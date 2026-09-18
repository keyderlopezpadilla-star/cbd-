"use client";

/**
 * Checkout (/checkout) - MOCK ONLY.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS A MOCK CHECKOUT. There is NO real payment processing and NO real
 * e-commerce provider wired here. It was a deliberate product decision (see the
 * task context): the storefront demonstrates the full flow against mock data.
 *
 * Multi-step flow: datos de envío -> método (mock) -> resumen -> confirmación.
 * On "confirmar pedido" we generate a fake order reference, show a confirmation
 * screen and clear the Zustand cart.
 *
 * ── WHERE A REAL PROVIDER WOULD INTEGRATE ───────────────────────────────────
 * To go live, replace `placeMockOrder()` below with a call into the commerce
 * layer (lib/commerce) that creates a real order/checkout session against
 * Shopify Storefront API or Medusa.js (e.g. `await commerce.createCheckout({
 * lines, shipping, paymentMethod })`) and redirect to the provider's hosted
 * payment page or confirm a PaymentIntent. The UI/step structure stays the
 * same; only the submit handler changes. Do NOT hardcode product data here -
 * always read the cart/commerce layer.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useT } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { useCartActions, useCartLines, useCartSubtotal } from "@/lib/store/cart";
import { Button, GlassCard } from "@/components/ui";

type Step = "envio" | "metodo" | "resumen" | "confirmacion";

interface ShippingData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  cp: string;
}

type PaymentMethod = "tarjeta" | "transferencia" | "contrareembolso";

const EMPTY_SHIPPING: ShippingData = {
  nombre: "",
  email: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  cp: "",
};

const STEP_LABELS: Record<Step, string> = {
  envio: "Envío",
  metodo: "Método",
  resumen: "Resumen",
  confirmacion: "Confirmación",
};

const METHOD_LABELS: Record<PaymentMethod, string> = {
  tarjeta: "Tarjeta (simulado)",
  transferencia: "Transferencia bancaria (simulado)",
  contrareembolso: "Contra reembolso (simulado)",
};

function validateShipping(data: ShippingData): Partial<Record<keyof ShippingData, string>> {
  const errors: Partial<Record<keyof ShippingData, string>> = {};
  if (!data.nombre.trim()) errors.nombre = "Indica tu nombre completo.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errors.email = "Introduce un email válido.";
  if (!/^[0-9+\s]{6,}$/.test(data.telefono)) errors.telefono = "Introduce un teléfono válido.";
  if (!data.direccion.trim()) errors.direccion = "Indica tu dirección.";
  if (!data.ciudad.trim()) errors.ciudad = "Indica tu ciudad.";
  if (!/^[0-9]{5}$/.test(data.cp)) errors.cp = "El código postal debe tener 5 dígitos.";
  return errors;
}

export default function CheckoutPage() {
  const t = useT();
  const lines = useCartLines();
  const subtotal = useCartSubtotal();
  const { clear } = useCartActions();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [step, setStep] = useState<Step>("envio");
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});
  const [method, setMethod] = useState<PaymentMethod>("tarjeta");
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const shippingCost = subtotal >= 50 ? 0 : 3.95;
  const total = subtotal + shippingCost;

  const steps: Step[] = ["envio", "metodo", "resumen", "confirmacion"];

  function set<K extends keyof ShippingData>(key: K, value: string) {
    setShipping((s) => ({ ...s, [key]: value }));
  }

  function submitShipping(event: React.FormEvent) {
    event.preventDefault();
    const found = validateShipping(shipping);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      setStep("metodo");
    }
  }

  /**
   * MOCK order placement. Replace with a real provider call (see file header).
   */
  function placeMockOrder() {
    const ref = `TBD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setOrderRef(ref);
    setStep("confirmacion");
    clear(); // empty the cart after a "successful" mock order
  }

  const emptyAndNotDone = mounted && lines.length === 0 && step !== "confirmacion";

  if (!mounted) {
    return <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6" aria-busy />;
  }

  if (emptyAndNotDone) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl text-offwhite">No hay nada que tramitar</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-offwhite/60">
          Tu carrito está vacío. Añade productos antes de pasar por caja.
        </p>
        <Link href={routes.shop} className="mt-8 inline-block">
          <Button size="lg">Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Mock banner */}
      <p className="mb-6 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
        Checkout de demostración: no se procesa ningún pago real ni se guarda ningún dato.
      </p>

      {/* Stepper */}
      <ol className="mb-10 flex flex-wrap gap-2 text-xs">
        {steps.map((s, i) => {
          const currentIndex = steps.indexOf(step);
          const done = i < currentIndex;
          const active = s === step;
          return (
            <li
              key={s}
              className={[
                "flex items-center gap-2 rounded-full border px-3 py-1.5",
                active
                  ? "border-gold bg-gold/15 text-gold"
                  : done
                    ? "border-green-moss/60 text-offwhite/70"
                    : "border-offwhite/15 text-offwhite/40",
              ].join(" ")}
            >
              <span className="font-semibold">{i + 1}</span>
              {STEP_LABELS[s]}
            </li>
          );
        })}
      </ol>

      {step === "envio" && (
        <form onSubmit={submitShipping} className="grid gap-4" noValidate>
          <h1 className="font-serif text-2xl text-offwhite">Datos de envío</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre completo" error={errors.nombre}>
              <input
                value={shipping.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                className="field-input"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={shipping.email}
                onChange={(e) => set("email", e.target.value)}
                className="field-input"
              />
            </Field>
            <Field label="Teléfono" error={errors.telefono}>
              <input
                value={shipping.telefono}
                onChange={(e) => set("telefono", e.target.value)}
                className="field-input"
              />
            </Field>
            <Field label="Código postal" error={errors.cp}>
              <input
                value={shipping.cp}
                onChange={(e) => set("cp", e.target.value)}
                className="field-input"
              />
            </Field>
            <Field label="Dirección" error={errors.direccion} className="sm:col-span-2">
              <input
                value={shipping.direccion}
                onChange={(e) => set("direccion", e.target.value)}
                className="field-input"
              />
            </Field>
            <Field label="Ciudad" error={errors.ciudad} className="sm:col-span-2">
              <input
                value={shipping.ciudad}
                onChange={(e) => set("ciudad", e.target.value)}
                className="field-input"
              />
            </Field>
          </div>
          <div className="flex justify-between">
            <Link href={routes.cart} className="text-sm text-offwhite/50 hover:text-gold">
              ← Volver al carrito
            </Link>
            <Button type="submit" size="lg">
              Continuar
            </Button>
          </div>
        </form>
      )}

      {step === "metodo" && (
        <div className="grid gap-4">
          <h1 className="font-serif text-2xl text-offwhite">Método de pago</h1>
          <p className="text-sm text-offwhite/55">
            Todos los métodos son simulados en esta demostración.
          </p>
          <fieldset className="grid gap-3">
            {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map((m) => (
              <label
                key={m}
                className={[
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm",
                  method === m
                    ? "border-gold bg-gold/10 text-offwhite"
                    : "border-gold/25 text-offwhite/70",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="accent-[color:var(--color-gold)]"
                />
                {METHOD_LABELS[m]}
              </label>
            ))}
          </fieldset>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep("envio")}
              className="text-sm text-offwhite/50 hover:text-gold"
            >
              ← Datos de envío
            </button>
            <Button size="lg" onClick={() => setStep("resumen")}>
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === "resumen" && (
        <div className="grid gap-6">
          <h1 className="font-serif text-2xl text-offwhite">Resumen del pedido</h1>
          <GlassCard className="p-5">
            <ul className="divide-y divide-gold/10">
              {lines.map((line) => (
                <li key={line.id} className="flex justify-between py-2 text-sm">
                  <span className="text-offwhite/80">
                    {line.name} · {line.variantLabel} × {line.quantity}
                  </span>
                  <span className="text-offwhite">
                    {(line.price * line.quantity).toFixed(2)}
                    {t.common.currency}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-gold/20 pt-4 text-sm">
              <div className="flex justify-between text-offwhite/70">
                <dt>Subtotal</dt>
                <dd>
                  {subtotal.toFixed(2)}
                  {t.common.currency}
                </dd>
              </div>
              <div className="flex justify-between text-offwhite/70">
                <dt>Envío</dt>
                <dd>
                  {shippingCost === 0 ? "Gratis" : `${shippingCost.toFixed(2)}${t.common.currency}`}
                </dd>
              </div>
              <div className="flex justify-between pt-2 font-serif text-lg text-gold">
                <dt>Total</dt>
                <dd>
                  {total.toFixed(2)}
                  {t.common.currency}
                </dd>
              </div>
            </dl>
          </GlassCard>
          <GlassCard className="p-5 text-sm text-offwhite/70">
            <p className="font-semibold text-offwhite">Envío a</p>
            <p className="mt-1">
              {shipping.nombre} · {shipping.direccion}, {shipping.cp} {shipping.ciudad}
            </p>
            <p className="mt-1">
              {shipping.email} · {shipping.telefono}
            </p>
            <p className="mt-3 font-semibold text-offwhite">Pago</p>
            <p className="mt-1">{METHOD_LABELS[method]}</p>
          </GlassCard>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep("metodo")}
              className="text-sm text-offwhite/50 hover:text-gold"
            >
              ← Método de pago
            </button>
            <Button size="lg" onClick={placeMockOrder}>
              Confirmar pedido
            </Button>
          </div>
        </div>
      )}

      {step === "confirmacion" && (
        <div className="py-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-moss/30 text-3xl text-gold">
            ✓
          </div>
          <h1 className="font-serif text-3xl text-offwhite">¡Pedido confirmado!</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-offwhite/65">
            Gracias por tu compra (simulada). Tu referencia de pedido es:
          </p>
          <p className="mt-3 font-serif text-2xl text-gold">{orderRef}</p>
          <p className="mx-auto mt-4 max-w-md text-xs text-offwhite/45">
            Este es un pedido de demostración. No se ha realizado ningún cargo ni se enviará ningún
            producto.
          </p>
          <Link href={routes.shop} className="mt-8 inline-block">
            <Button size="lg">Seguir explorando</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={["block", className].filter(Boolean).join(" ")}>
      <span className="text-sm text-offwhite/70">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-gold">{error}</span>}
    </label>
  );
}
