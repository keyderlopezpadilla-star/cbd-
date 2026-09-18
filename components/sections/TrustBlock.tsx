"use client";

/**
 * Trust block: the four reassurance points (envío 24/48h, pago seguro,
 * devoluciones, atención al cliente). Reveals on scroll via <Section>.
 */
import { useT } from "@/lib/i18n";
import { GlassCard, Section } from "@/components/ui";

function ShippingIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}
function SecureIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}
function ReturnsIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M4 9a8 8 0 1 1-1.5 5" />
      <path d="M4 4v5h5" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M4 11a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2" />
      <rect x="3" y="11" width="3" height="5" rx="1" />
      <rect x="18" y="11" width="3" height="5" rx="1" />
    </svg>
  );
}

export function TrustBlock() {
  const t = useT();
  const items = [
    { icon: <ShippingIcon />, ...t.trust.shipping },
    { icon: <SecureIcon />, ...t.trust.securePayment },
    { icon: <ReturnsIcon />, ...t.trust.returns },
    { icon: <SupportIcon />, ...t.trust.support },
  ];

  return (
    <Section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h2 className="sr-only">{t.trust.title}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <GlassCard as="li" key={item.title} className="flex flex-col gap-3 p-6">
            <span className="text-gold">{item.icon}</span>
            <h3 className="font-serif text-lg text-offwhite">{item.title}</h3>
            <p className="text-sm text-offwhite/65">{item.text}</p>
          </GlassCard>
        ))}
      </ul>
    </Section>
  );
}

export default TrustBlock;
