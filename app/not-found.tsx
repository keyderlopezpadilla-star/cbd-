/**
 * 404 - on-brand not-found page.
 *
 * The dove mascot is a client island (lazy 3D with 2D/reduced-motion fallback
 * handled inside <Mascot>); the rest is a server component.
 */
import Link from "next/link";

import { routes } from "@/lib/routes";
import { Mascot } from "@/components/mascots";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:px-6">
      <Mascot name="dove" size={170} reactTo={["idle", "hover", "click"]} />
      <p className="font-serif text-6xl text-gold text-gold-glow">404</p>
      <h1 className="font-serif text-3xl text-offwhite">Esta página se ha perdido</h1>
      <p className="max-w-md text-sm text-offwhite/60">
        No hemos encontrado lo que buscas. Puede que el enlace haya cambiado o que la página ya no
        exista. Vuelve al inicio o explora nuestra tienda.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={routes.home}>
          <Button size="lg">Volver al inicio</Button>
        </Link>
        <Link href={routes.shop}>
          <Button size="lg" variant="outline">
            Ir a la tienda
          </Button>
        </Link>
      </div>
    </div>
  );
}
