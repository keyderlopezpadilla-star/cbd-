# Mascotas 3D — The Best Dreams

Esta carpeta contiene (más adelante) los modelos `.glb` definitivos de la
tripulación de mascotas. Hoy el sistema usa **placeholders de geometría
primitiva low-poly originales** (esferas, cajas, conos y cilindros con material
toon) creados a mano en `components/mascots/scenes/`. No están calcados ni
derivados de ninguna ilustración del cliente: son siluetas originales en la
paleta de marca.

## La tripulación y sus roles

| `name`   | Animal            | Rol                                              |
| -------- | ----------------- | ------------------------------------------------ |
| `lion`   | León (melena oro) | "The Guide" / jefe → modal de edad + onboarding  |
| `eagle`  | Águila coronada   | "The Expert" → páginas de producto / laboratorio |
| `panda`  | Panda con gafas   | Ofertas → carrito / newsletter                   |
| `monkey` | Mono con cetro    | Ofertas (alternativa)                            |
| `dove`   | Paloma dorada     | Acento de loader / motivo secundario             |

## Nombres de archivo esperados

Coloca los modelos exactamente con estos nombres:

```
public/mascots/lion.glb
public/mascots/eagle.glb
public/mascots/panda.glb
public/mascots/monkey.glb
public/mascots/dove.glb
```

## Presupuesto recomendado

- **Polígonos:** ≤ 30–40k triángulos por mascota (idealmente 10–20k). Son
  elementos decorativos que conviven con el resto de la UI.
- **Formato:** glTF binario `.glb`, con mallas y materiales embebidos.
- **Materiales:** PBR estándar o un material toon exportado. El material toon
  actual (`MeshToonMaterial` + gradient map de 4 pasos) da el look "placeholder
  con personalidad"; mantén un aspecto cel-shaded si quieres coherencia.
- **Texturas:** ≤ 1024×1024, comprimidas (KTX2/Basis si es posible).
- **Escala/orientación:** centra el modelo en el origen, mirando a +Z, con una
  altura aproximada de ~2 unidades (encaja con la cámara del canvas).
- **Animaciones:** opcionales. El sistema aplica su propio idle
  (respiración/parpadeo/balanceo) y reacciones vía `useMascotMotion`, así que un
  modelo estático ya "cobra vida".

## Cómo sustituir un placeholder por un `.glb` (cambio de UNA línea)

El sistema tiene una **única costura de intercambio**: el registro de escenas en
`components/mascots/registry.ts`. No hay que tocar los llamadores
(`<Mascot name="lion" />`) ni la lógica de animación/eventos.

1. Copia el modelo a `public/mascots/<name>.glb`.
2. Crea una escena GLB que respete el mismo contrato `MascotSceneProps`
   (`components/mascots/scenes/GLBScene.tsx`):

   ```tsx
   import { useGLTF } from "@react-three/drei";
   import { useRef } from "react";
   import * as THREE from "three";
   import type { MascotSceneProps } from "../types";
   import { useMascotMotion } from "./useMascotMotion";

   export function makeGLBScene(url: string) {
     function GLBScene({ event, reducedMotion }: MascotSceneProps) {
       const group = useRef<THREE.Group>(null);
       useMascotMotion(group, event, reducedMotion, true);
       const { scene } = useGLTF(url);
       return (
         <group ref={group}>
           <primitive object={scene} />
         </group>
       );
     }
     return GLBScene;
   }

   // Precarga opcional para evitar el parpadeo del primer render:
   useGLTF.preload("/mascots/lion.glb");
   ```

3. Cambia **una línea** en `components/mascots/registry.ts`:

   ```diff
   - lion: LionScene,
   + lion: makeGLBScene("/mascots/lion.glb"),
   ```

El resto sigue igual: mismo idle loop y mismas reacciones
(hover / click / scroll-into-view / add-to-cart), y el fallback 2D y el respeto
a `prefers-reduced-motion` no cambian.
