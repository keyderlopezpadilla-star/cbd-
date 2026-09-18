/**
 * Blog post detail (/blog/[slug]).
 *
 * Server component: resolves the post from lib/content/blog.ts, 404s on unknown
 * slugs via notFound(), and statically pre-renders every post with
 * generateStaticParams. Body paragraphs prefixed with "## " render as section
 * headings; the rest are prose paragraphs.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import { routes } from "@/lib/routes";

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Artículo no encontrado" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-xs text-offwhite/50">
        <Link href={routes.blog} className="hover:text-gold">
          Magazine
        </Link>{" "}
        / <span className="text-offwhite/70">{post.title}</span>
      </nav>

      <header className="border-b border-gold/20 pb-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gold/30 px-2.5 py-0.5 text-xs uppercase tracking-wider text-gold"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-4 font-serif text-3xl leading-tight text-offwhite sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-offwhite/55">
          {post.author} · {formatDate(post.date)} · {post.readingMinutes} min de lectura
        </p>
      </header>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-offwhite/80">
        {post.body.map((block, i) =>
          block.startsWith("## ") ? (
            <h2 key={i} className="pt-4 font-serif text-2xl text-offwhite">
              {block.replace(/^##\s+/, "")}
            </h2>
          ) : (
            <p key={i}>{block}</p>
          ),
        )}
      </div>

      <footer className="mt-12 rounded-2xl border border-gold/20 p-5 text-xs leading-relaxed text-offwhite/55">
        Contenido divulgativo de The Best Dreams. La información de este artículo no sustituye el
        consejo de un profesional sanitario. Todos nuestros productos derivan del cáñamo industrial
        legal en España, con un contenido de THC inferior al 0,2%.
      </footer>
    </article>
  );
}
