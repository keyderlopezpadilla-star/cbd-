"use client";

/**
 * AgeGate - blocking 18+ age-verification modal.
 *
 * Accessibility contract:
 *   - role="dialog" aria-modal, labelled + described by its heading/intro.
 *   - Focus is moved into the dialog on open and TRAPPED with Tab/Shift+Tab.
 *   - ESC does NOT dismiss the gate (age verification must be an explicit
 *     choice), and there is no backdrop-click escape either.
 *   - Acceptance is remembered in localStorage so returning visitors are not
 *     asked again.
 *   - The Lion ("The Guide") mascot welcomes the visitor.
 *
 * While unconfirmed, the modal renders over the whole app and locks scroll.
 */
import { useCallback, useEffect, useRef, useState } from "react";

import { useT } from "@/lib/i18n";
import { Mascot } from "@/components/mascots";
import { Button } from "@/components/ui";

const STORAGE_KEY = "tbd-age-verified";
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function AgeGate() {
  const t = useT();
  // Start "verified" so SSR/first paint doesn't flash the gate; the effect
  // opens it on the client when there is no stored acceptance.
  const [verified, setVerified] = useState(true);
  const [denied, setDenied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      accepted = false;
    }
    setVerified(accepted);
  }, []);

  const open = !verified;

  // Lock body scroll and move focus into the dialog while it is open.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Keep focus inside the dialog when switching between the choice and denied
  // states so the focus-trap never runs out of focusable targets.
  useEffect(() => {
    if (!open) return;
    if (denied) {
      backRef.current?.focus();
    } else {
      confirmRef.current?.focus();
    }
  }, [open, denied]);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    // ESC must NOT bypass the gate.
    if (event.key === "Escape") {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute("disabled"),
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  function confirm() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage failures; the session still proceeds.
    }
    setVerified(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onKeyDown={onKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-heading"
        aria-describedby="age-gate-intro"
        className="glass gold-glow w-full max-w-lg rounded-3xl p-8 text-center"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-gold">{t.ageGate.title}</p>

        <div className="mx-auto my-4 flex justify-center" aria-hidden>
          <Mascot name="lion" size={150} />
        </div>
        <p className="text-sm text-offwhite/60">{t.ageGate.welcome}</p>

        <h2 id="age-gate-heading" className="mt-4 font-serif text-2xl text-offwhite">
          {t.ageGate.heading}
        </h2>
        <p id="age-gate-intro" className="mt-3 text-sm text-offwhite/70">
          {t.ageGate.intro}
        </p>

        {denied ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="rounded-xl bg-black/50 px-4 py-3 text-sm text-offwhite/80">
              {t.ageGate.denied}
            </p>
            {/* Keeps a focusable element in the denied state so the Tab
                focus-trap stays contained; returning to the choice does NOT
                bypass the gate. */}
            <Button ref={backRef} size="lg" variant="outline" onClick={() => setDenied(false)}>
              {t.ageGate.back}
            </Button>
          </div>
        ) : (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button ref={confirmRef} size="lg" onClick={confirm}>
              {t.ageGate.confirm}
            </Button>
            <Button size="lg" variant="outline" onClick={() => setDenied(true)}>
              {t.ageGate.deny}
            </Button>
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-offwhite/45">{t.ageGate.legal}</p>
      </div>
    </div>
  );
}

export default AgeGate;
