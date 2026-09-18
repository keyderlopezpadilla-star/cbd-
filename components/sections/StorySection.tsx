"use client";

/**
 * StorySection - one chapter of the home scroll-storytelling sequence
 * (origen del cultivo -> proceso -> producto -> confianza). Each chapter
 * reveals on scroll via <Section> (reduced-motion aware) and alternates the
 * media/text sides on wide screens.
 */
import { Section } from "@/components/ui";

export interface StorySectionProps {
  index: number;
  kicker: string;
  title: string;
  body: string;
  /** Flip the media to the right on desktop for an alternating rhythm. */
  flip?: boolean;
}

export function StorySection({ index, kicker, title, body, flip = false }: StorySectionProps) {
  return (
    <Section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div
        className={[
          "grid items-center gap-8 md:grid-cols-2",
          flip ? "md:[direction:rtl]" : "",
        ].join(" ")}
      >
        <div className="md:[direction:ltr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/20 bg-[radial-gradient(90%_90%_at_30%_20%,rgba(201,162,75,0.18),transparent_60%),linear-gradient(160deg,#141412,#3E4B34)]">
            <span className="absolute left-6 top-6 font-serif text-6xl text-gold/30">0{index}</span>
          </div>
        </div>
        <div className="md:[direction:ltr]">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{kicker}</p>
          <h2 className="mt-3 font-serif text-2xl text-offwhite sm:text-3xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-offwhite/70">{body}</p>
        </div>
      </div>
    </Section>
  );
}

export default StorySection;
