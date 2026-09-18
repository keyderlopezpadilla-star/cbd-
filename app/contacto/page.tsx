"use client";

/**
 * Contacto (/contacto).
 *
 * Client page with a mock contact form (client-side validation, no backend),
 * the local service zones, a lightweight map placeholder and business info.
 * On a valid submit it shows an in-page confirmation; nothing is sent anywhere.
 */
import { useState } from "react";

import { BRAND_ZONES } from "@/lib/commerce/mock-data";
import { Button, GlassCard, Section } from "@/components/ui";

interface ContactForm {
  nombre: string;
  email: string;
  mensaje: string;
}

const EMPTY: ContactForm = { nombre: "", email: "", mensaje: "" };

function validate(form: ContactForm): Partial<Record<keyof ContactForm, string>> {
  const errors: Partial<Record<keyof ContactForm, string>> = {};
  if (!form.nombre.trim()) errors.nombre = "Indica tu nombre.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = "Introduce un email válido.";
  if (form.mensaje.trim().length < 10)
    errors.mensaje = "Cuéntanos un poco más (mín. 10 caracteres).";
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [sent, setSent] = useState(false);

  function set<K extends keyof ContactForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      // MOCK: no backend. A real project would POST to an API route / CRM here.
      setSent(true);
      setForm(EMPTY);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Contacto</p>
        <h1 className="mt-2 font-serif text-3xl text-offwhite sm:text-4xl">Hablemos</h1>
        <p className="mt-3 max-w-2xl text-sm text-offwhite/65">
          ¿Tienes una duda sobre un producto o tu pedido? Escríbenos y te responderemos lo antes
          posible.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <Section noReveal>
          <GlassCard className="p-6">
            {sent ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-moss/30 text-2xl text-gold">
                  ✓
                </div>
                <h2 className="font-serif text-2xl text-offwhite">¡Mensaje enviado!</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-offwhite/60">
                  Gracias por escribirnos (mensaje de demostración). Te responderemos pronto.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <label className="block">
                  <span className="text-sm text-offwhite/70">Nombre</span>
                  <input
                    value={form.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    className="field-input mt-1"
                  />
                  {errors.nombre && (
                    <span className="mt-1 block text-xs text-gold">{errors.nombre}</span>
                  )}
                </label>
                <label className="block">
                  <span className="text-sm text-offwhite/70">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="field-input mt-1"
                  />
                  {errors.email && (
                    <span className="mt-1 block text-xs text-gold">{errors.email}</span>
                  )}
                </label>
                <label className="block">
                  <span className="text-sm text-offwhite/70">Mensaje</span>
                  <textarea
                    value={form.mensaje}
                    onChange={(e) => set("mensaje", e.target.value)}
                    rows={5}
                    className="mt-1 block w-full rounded-lg border border-gold/30 bg-black/40 p-3 text-sm text-offwhite placeholder:text-offwhite/40 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  />
                  {errors.mensaje && (
                    <span className="mt-1 block text-xs text-gold">{errors.mensaje}</span>
                  )}
                </label>
                <Button type="submit" size="lg">
                  Enviar mensaje
                </Button>
                <p className="text-xs text-offwhite/45">
                  Al enviar aceptas nuestra política de privacidad. Formulario de demostración: no
                  se envía a ningún servidor.
                </p>
              </form>
            )}
          </GlassCard>
        </Section>

        {/* Info + zones + map placeholder */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="font-serif text-xl text-offwhite">Información</h2>
            <dl className="mt-4 space-y-3 text-sm text-offwhite/70">
              <div>
                <dt className="text-offwhite/50">Atención al cliente</dt>
                <dd>Lunes a sábado, de 10:00 a 20:00</dd>
              </div>
              <div>
                <dt className="text-offwhite/50">Región</dt>
                <dd>Valencia, España</dd>
              </div>
              <div>
                <dt className="text-offwhite/50">Email</dt>
                <dd>hola@thebestdreams.example</dd>
              </div>
            </dl>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-serif text-xl text-offwhite">Zonas de servicio</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {BRAND_ZONES.map((zone) => (
                <li
                  key={zone}
                  className="rounded-full border border-gold/30 px-3 py-1 text-sm text-offwhite/80"
                >
                  {zone}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Map placeholder (no external tiles / network). */}
          <div
            role="img"
            aria-label="Mapa de la zona de servicio en la comarca de la Ribera, Valencia"
            className="relative h-56 overflow-hidden rounded-2xl border border-gold/20 bg-[linear-gradient(135deg,#141412,#3E4B34)]"
          >
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(201,162,75,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(201,162,75,0.25)_1px,transparent_1px)] [background-size:28px_28px]" />
            <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_0_6px_rgba(201,162,75,0.25)]" />
            <span className="absolute bottom-3 left-3 text-xs text-offwhite/60">
              Comarca de la Ribera · Valencia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
