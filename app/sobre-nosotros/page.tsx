/**
 * Sobre nosotros (/sobre-nosotros).
 *
 * Brand story, cultivo and sostenibilidad, with local service zones and the
 * mascot crew. Uses the same reveal-on-scroll <Section> storytelling rhythm as
 * the home page. Server component with the mascots as client islands.
 */
import type { Metadata } from "next";

import { BRAND_ZONES } from "@/lib/commerce/mock-data";
import { Mascot } from "@/components/mascots";
import { GlassCard, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "La historia de The Best Dreams: cultivo de cáñamo premium en Valencia, elaboración artesanal y compromiso con la sostenibilidad. Donde hay calidad no hay competencia.",
  alternates: { canonical: "/sobre-nosotros" },
};

const CHAPTERS = [
  {
    kicker: "Nuestra historia",
    title: "Nacidos de la tierra valenciana",
    body: "The Best Dreams nace de la pasión por el cáñamo bien hecho. Empezamos cuidando unas pocas plantas en la huerta de Algemesí y hoy seleccionamos genéticas premium con el mismo mimo del primer día. Nuestro lema lo resume todo: donde hay calidad no hay competencia.",
  },
  {
    kicker: "Cultivo",
    title: "Interior, exterior e invernadero",
    body: "Trabajamos los tres métodos de cultivo para ofrecer perfiles distintos y auténticos. Controlamos cada fase, del sustrato al curado, porque creemos que la excelencia está en los detalles y en el tiempo que dedicamos a cada cosecha.",
  },
  {
    kicker: "Sostenibilidad",
    title: "Respeto por el entorno",
    body: "Priorizamos prácticas responsables: aprovechamos la luz del sol mediterráneo, reducimos residuos y apostamos por envases reutilizables como nuestros botes herméticos con filtro UV. Cuidar el producto es también cuidar la tierra que lo hace posible.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <Section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6" noReveal>
        <p className="text-xs uppercase tracking-[0.4em] text-gold">The Best Dreams</p>
        <h1 className="mt-4 font-serif text-4xl text-offwhite sm:text-5xl">
          Donde hay calidad
          <br />
          <span className="text-gold text-gold-glow">no hay competencia</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-offwhite/70">
          Somos una casa de CBD y cáñamo legal premium con raíces en Valencia. Esta es nuestra
          historia, nuestro cultivo y nuestro compromiso.
        </p>
      </Section>

      <div className="border-y border-gold/10 bg-[linear-gradient(180deg,transparent,rgba(62,75,52,0.12),transparent)]">
        {CHAPTERS.map((chapter, i) => (
          <Section key={chapter.kicker} className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/20 bg-[radial-gradient(90%_90%_at_30%_20%,rgba(201,162,75,0.18),transparent_60%),linear-gradient(160deg,#141412,#3E4B34)]">
                  <span className="absolute left-6 top-6 font-serif text-6xl text-gold/30">
                    0{i + 1}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{chapter.kicker}</p>
                <h2 className="mt-3 font-serif text-2xl text-offwhite sm:text-3xl">
                  {chapter.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-offwhite/70">{chapter.body}</p>
              </div>
            </div>
          </Section>
        ))}
      </div>

      {/* Local zones */}
      <Section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="font-serif text-2xl text-offwhite">Nuestras zonas</h2>
        <p className="mt-2 max-w-2xl text-sm text-offwhite/65">
          Enviamos a toda España y servimos de forma especial en nuestra comarca:
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BRAND_ZONES.map((zone) => (
            <GlassCard as="li" key={zone} className="p-5 text-center">
              <p className="font-serif text-lg text-gold">{zone}</p>
              <p className="mt-1 text-xs text-offwhite/50">Valencia</p>
            </GlassCard>
          ))}
        </ul>
      </Section>

      {/* Mascot crew */}
      <Section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-2xl text-offwhite">Nuestra tripulación</h2>
        <p className="mt-2 max-w-2xl text-sm text-offwhite/65">
          Un equipo de personajes que te acompaña por toda la tienda: el guía, el experto y los
          animadores de las ofertas.
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { name: "lion", role: "El Guía", desc: "Te da la bienvenida y te orienta." },
              { name: "eagle", role: "The Expert", desc: "Explica cannabinoides y análisis." },
              { name: "panda", role: "Ofertas", desc: "Celebra tus compras y descuentos." },
              { name: "dove", role: "El Emblema", desc: "La paloma dorada de la marca." },
            ] as const
          ).map((m) => (
            <GlassCard as="li" key={m.name} className="flex flex-col items-center gap-2 p-5">
              <Mascot name={m.name} size={130} reactTo={["idle", "hover", "click", "inview"]} />
              <p className="font-serif text-lg text-gold">{m.role}</p>
              <p className="text-center text-xs text-offwhite/55">{m.desc}</p>
            </GlassCard>
          ))}
        </ul>
      </Section>
    </div>
  );
}
