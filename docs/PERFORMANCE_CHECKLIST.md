# Checklist de rendimiento (Lighthouse)

Lista de verificación antes del lanzamiento de **The Best Dreams**. Objetivo: **≥ 90** en las
cuatro categorías de Lighthouse en móvil y escritorio.

## Objetivos Lighthouse (≥ 90)

- [ ] **Performance ≥ 90** (móvil y escritorio)
- [ ] **Accessibility ≥ 90**
- [ ] **Best Practices ≥ 90**
- [ ] **SEO ≥ 90**

### Core Web Vitals de referencia

- [ ] **LCP** < 2.5 s
- [ ] **CLS** < 0.1
- [ ] **INP** < 200 ms
- [ ] **TBT** bajo (el 3D no bloquea el hilo principal en el primer render)

## Medidas ya aplicadas en el código

- [ ] **3D lazy-load, nunca en SSR.** `MascotCanvas` y `Hero3DScene` se importan con
      `next/dynamic({ ssr: false })` (ver `components/mascots/Mascot.tsx` y
      `components/sections/Hero3D.tsx`), de modo que WebGL nunca bloquea el primer paint.
- [ ] **Fallback 2D como placeholder de carga.** La silueta 2D
      (`components/mascots/Mascot2DFallback.tsx`) se muestra mientras se hidrata el canvas y
      de forma permanente si no hay WebGL o el dispositivo es de gama baja
      (`components/mascots/webgl.ts`).
- [ ] **Clamp de `dpr`.** El canvas de mascotas usa `dpr={[1, 1.75]}`
      (`components/mascots/MascotCanvas.tsx`) y el hero `dpr={[1, 1.75]}`
      (`components/sections/Hero3DScene.tsx`) para no renderizar de más en pantallas HiDPI.
      Además `powerPreference: "low-power"` en ambos `<Canvas>`.
- [ ] **`prefers-reduced-motion` respetado.** `lib/motion/useReducedMotion.ts` desactiva idle
      loops, tilt de tarjetas y parallax; con reduced-motion el 3D decorativo del hero ni
      siquiera se monta (se usa el gradiente estático).
- [ ] **Imágenes con `next/image`.** Producto y logo usan `next/image` (ver
      `components/product/ProductCard.tsx` y `components/layout/Header.tsx`), con `priority`
      solo donde procede para no penalizar el LCP.
- [ ] **Code-splitting por ruta.** El App Router divide el bundle por ruta; los componentes
      con estado (client components) se aíslan detrás del `AppShell` para mantener servidor las
      páginas de contenido.
- [ ] **Fuentes con `display: "swap"`.** Playfair Display e Inter se cargan con
      `next/font/google` y `display: "swap"` (ver `app/layout.tsx`), evitando FOIT y layout shift.
- [ ] **Generación estática (SSG).** Catálogo por categoría, fichas de producto y artículos del
      blog se pre-renderizan con `generateStaticParams` (ver `app/tienda/[categoria]/page.tsx`,
      `app/producto/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`).
- [ ] **Memoización.** Cálculos de partículas y geometría del 3D se memoizan (`useMemo` en
      `components/mascots/MascotCanvas.tsx`); el `delta` de animación se _clampa_ en
      `components/mascots/scenes/useMascotMotion.ts` para no teletransportar la animación tras
      una pestaña pausada.
- [ ] **Montaje diferido del 3D por viewport.** `lib/motion/useInViewOnce.ts`
      (IntersectionObserver de un solo disparo) evita activar animaciones fuera de pantalla.

## Medidas recomendadas antes de lanzar

- [ ] Ejecutar `npm run build` y revisar el reporte de tamaños de bundle por ruta.
- [ ] Auditar con Lighthouse (CI o DevTools) en móvil emulado y corregir regresiones.
- [ ] Optimizar los `.glb` finales (≤ 10–20k triángulos, texturas ≤ 1024², KTX2/Basis) y
      considerar `useGLTF.preload` para las mascotas críticas.
- [ ] Servir imágenes de producto reales en tamaños/relación correctos y con `sizes` adecuados.
- [ ] Verificar `alt` en todas las imágenes y foco/teclado en modales (age gate) y navegación.
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` para metadatos/canonical correctos y añadir sitemap.
- [ ] Revisar cabeceras de caché/CDN para assets estáticos (`public/`) y salida de `next build`.
- [ ] Comprobar que no hay long tasks del 3D en dispositivos de gama baja (fallback 2D activo).
