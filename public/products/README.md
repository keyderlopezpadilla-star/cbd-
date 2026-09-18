# Imágenes de producto

Todos los productos del catálogo mock apuntan actualmente a una **única imagen de
prueba compartida**: `placeholder.jpg`.

## Cambiar la imagen de prueba de todos los productos

Sustituye el archivo `public/products/placeholder.jpg` por la imagen que quieras
(mismo nombre). Todos los productos la mostrarán automáticamente, sin tocar código.

> Se recomienda una imagen cuadrada o vertical (p. ej. 1000×1000 o 800×1200) en
> `.jpg`/`.png`/`.webp`. Si cambias la extensión, actualiza también el campo
> `images` en `lib/commerce/mock-data.ts`.

## Volver a imágenes individuales por producto

Edita el array `images` de cada producto en `lib/commerce/mock-data.ts`, por ejemplo:

```ts
images: ["/products/amnesia-haze-interior.jpg"],
```

Los archivos originales por producto siguen en esta carpeta (amnesia-haze-interior.jpg,
og-kush-exterior.jpg, etc.) por si quieres restaurarlos.
