# Plantilla de productos (para rellenar en Excel / Google Sheets)

Rellena el archivo **[`plantilla-productos.csv`](./plantilla-productos.csv)** —
**una fila por producto**— y devuélvemelo (o pega su contenido en el chat).
Con eso genero el catálogo completo de la tienda automáticamente.

## Cómo abrirlo

- **Excel:** botón derecho sobre `plantilla-productos.csv` → Abrir con Excel. Si los
  acentos se ven raros, en Excel usa _Datos → Desde texto/CSV_ y elige codificación
  **UTF-8** y separador **coma**.
- **Google Sheets:** _Archivo → Importar → Subir_ el CSV. Al terminar, descárgalo de
  nuevo como CSV (_Archivo → Descargar → .csv_) antes de enviármelo.
- Deja la **primera fila de títulos tal cual** y escribe cada producto debajo.

## Qué poner en cada columna

| Columna              | Qué escribir                                                                                                              | ¿Obligatorio? |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `nombre`             | Nombre del producto.                                                                                                      | Sí            |
| `categoria`          | Una de: **Flores CBD**, **Hachís y Extractos**, **Aceites CBD**, **Vaporizadores**, **Accesorios**, **Semillas CBD/CBG**. | Sí            |
| `descripcion_corta`  | Una frase (aparece en la tarjeta).                                                                                         | Sí            |
| `descripcion_larga`  | 2–4 frases (aparece en la ficha).                                                                                         | Recomendado   |
| `cbd_percent`        | Número, % de CBD (ej. `12`). Si no aplica, `0`.                                                                           | Sí            |
| `cbg_percent`        | Número, % de CBG. Si no aplica, `0`.                                                                                       | No            |
| `terpenos`           | Lista separada por comas: `Mirceno, Limoneno`. Entre comillas si lleva comas.                                             | No            |
| `origen`             | Ej. `Cultivo propio en Algemesí (Valencia)`.                                                                              | No            |
| `metodo`             | Solo flores/extractos: `interior`, `exterior` o `invernadero`. En lo demás: `no aplica`.                                  | No            |
| `variantes`          | Formatos y precios (ver formato abajo). **Al menos uno.**                                                                 | Sí            |
| `etiquetas`          | Cualquiera de: `nuevo`, `oferta`, `mas-vendido`, `agotado`. Varias separadas por coma, o vacío.                           | No            |
| `imagen`             | Nombre del archivo de foto propia (súbelo a `public/products/`). Vacío = se usa la imagen común.                          | No            |
| `pdf_laboratorio`    | Nombre del PDF de análisis (súbelo a `public/lab-pdfs/`). Vacío = sin certificado.                                        | No            |
| `disclaimer_especial`| Texto legal propio de ese producto. Vacío = uso el disclaimer legal por categoría.                                        | No            |

## Formato de la columna `variantes` (¡la más importante!)

Cada variante es un **tamaño**, su **precio en €** y si está **disponible**, así:

```
tamaño=precio=si|no
```

Y se separan varias con la barra `|`. Ejemplos:

- Flores/hachís (gramos): `1g=8.90=si | 3g=24.00=si | 5g=38.00=si | 10g=70.00=no`
- Aceites (mililitros): `10ml=29.90=si | 30ml=69.90=si`
- Accesorios/semillas (unidades): `1 ud=12.00=si` · `3 semillas=25.00=si`

Reglas:
- Usa **punto o coma** para los decimales (`8.90` o `8,90`), yo lo normalizo.
- `si` = disponible, `no` = agotado.
- El precio "desde" que se muestra en la web se calcula solo (el más barato disponible).

## Ejemplos

El propio CSV ya trae **2 filas de ejemplo** (una flor y un aceite) para que veas el
formato. **Bórralas** y escribe las tuyas, o escribe debajo y luego me dices que ignore
las de ejemplo.

## Cuando lo tengas listo

Envíame el CSV (adjunto o pegando su contenido). Yo:
1. Convierto cada fila en un producto del catálogo (`lib/commerce/mock-data.ts`).
2. Aplico categorías, variantes, precios, etiquetas y disclaimers.
3. Lo publico en el repo → Vercel despliega la tienda con tus productos reales.
