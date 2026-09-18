/**
 * Blog / Magazine list (/blog).
 *
 * Educational SEO magazine. Server component that lists the original posts from
 * lib/content/blog.ts. Detail pages live at /blog/[slug].
 */
import type { Metadata } from "next";
import Link from "next/link";

import { getAllPosts } from "@/lib/content/blog";
import { routes } from "@/lib/routes";
import { GlassCard, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Magazine",
  description:
    "Contenido educativo sobre CBD, cáñamo, terpenos, métodos de cultivo y análisis de laboratorio. El magazine de The Best Dreams.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Magazine</p>
        <h1 className="mt-2 font-serif text-3xl text-offwhite sm:text-4xl">
          Aprende sobre el mundo del CBD
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-offwhite/65">
          Guías, conceptos y buenas prácticas escritas por el equipo de The Best Dreams. Contenido
          divulgativo, nunca sustituto de un consejo profesional.
        </p>
      </header>

      <Section>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <GlassCard as="li" key={post.slug} className="flex flex-col overflow-hidden">
              <Link href={routes.blogPost(post.slug)} className="group flex h-full flex-col">
                <div className="relative aspect-[16/10] bg-[radial-gradient(90%_90%_at_30%_20%,rgba(201,162,75,0.2),transparent_60%),linear-gradient(160deg,#141412,#3E4B34)]" />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-xs uppercase tracking-wider text-gold">
                    {post.tags[0]} · {post.readingMinutes} min
                  </p>
                  <h2 className="font-serif text-xl leading-tight text-offwhite group-hover:text-gold">
                    {post.title}
                  </h2>
                  <p className="line-clamp-3 text-sm text-offwhite/65">{post.excerpt}</p>
                  <p className="mt-auto pt-3 text-xs text-offwhite/45">
                    {post.author} · {formatDate(post.date)}
                  </p>
                </div>
              </Link>
            </GlassCard>
          ))}
        </ul>
      </Section>
    </div>
  );
}
