"use client";

/**
 * Newsletter section with a first-purchase discount incentive. On a successful
 * subscribe, the Deals mascot (panda) fires its celebratory reaction: we reuse
 * the mascot's `addToCartSignal` prop as a generic "celebrate now" counter,
 * incrementing it on submit. Nothing here is wired to a real backend.
 */
import { useState } from "react";

import { useT } from "@/lib/i18n";
import { Mascot } from "@/components/mascots";
import { Button, GoldGlow, Section } from "@/components/ui";

export function Newsletter() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [celebrate, setCelebrate] = useState(0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setCelebrate((c) => c + 1); // trigger the Deals mascot celebration
  }

  return (
    <Section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <GoldGlow className="grid items-center gap-8 p-8 md:grid-cols-[auto_1fr] md:p-12">
        <div className="mx-auto">
          <Mascot name="panda" size={160} addToCartSignal={celebrate} />
        </div>

        <div>
          <h2 className="font-serif text-2xl text-offwhite md:text-3xl">{t.newsletter.title}</h2>
          <p className="mt-2 text-gold">{t.newsletter.incentive}</p>
          <p className="mt-3 max-w-prose text-sm text-offwhite/65">{t.newsletter.text}</p>

          {subscribed ? (
            <p className="mt-6 rounded-xl bg-green-rustic/40 px-4 py-3 text-sm text-offwhite">
              {t.newsletter.success}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">{t.newsletter.placeholder}</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="h-11 w-full rounded-full border border-gold/40 bg-black/40 px-5 text-sm text-offwhite placeholder:text-offwhite/40 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                />
              </label>
              <Button type="submit" size="md">
                {t.newsletter.cta}
              </Button>
            </form>
          )}
          <p className="mt-3 text-xs text-offwhite/45">{t.newsletter.consent}</p>
        </div>
      </GoldGlow>
    </Section>
  );
}

export default Newsletter;
