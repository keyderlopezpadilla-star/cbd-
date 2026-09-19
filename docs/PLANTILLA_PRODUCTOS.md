# Plantilla de productos (Excel para el cliente)

Plantilla completa y profesional para dar de alta el catálogo de **The Best Dreams**.

📗 **[`plantilla-productos.xlsx`](./plantilla-productos.xlsx)** — Excel con **52 campos**
organizados en **11 secciones**, listas desplegables, cabeceras de color, fila de
títulos congelada y una fila de ejemplo.

También queda el CSV simple anterior (`plantilla-productos.csv`) por si se prefiere,
pero **el Excel es el formato recomendado** para el cliente.

## Estructura de la hoja «Productos»

- **Fila 1** — grupos de sección, cada uno con su color:
  Identificación · Cannabinoides · Producto · Precios · Stock · Trazabilidad · Uso ·
  Envío · Imágenes · Contenido web · Gestión.
- **Fila 2** — títulos de cada campo (congelada; **no borrar**).
- **Fila 3** — un producto de **ejemplo** ya relleno (bórralo y escribe los tuyos).
- **A partir de la fila 3** — una fila por producto.

## Campos por sección

- **Identificación:** ID, SKU, EAN, Nombre_Producto, Marca, Proveedor, Categoria, Subcategoria, Formato
- **Cannabinoides:** Espectro, CBD_mg, CBD_%, THC_%, Otros_Cannabinoides
- **Producto:** Contenido_Neto, Unidad_Medida, Ingredientes, Aceite_Portador, Sabor_Aroma
- **Precios:** Precio_Venta, Precio_Oferta, Precio_Coste, IVA_%, Moneda
- **Stock:** Stock, Stock_Minimo, Disponibilidad
- **Trazabilidad:** Lote, Fecha_Caducidad, Origen_Cañamo, Metodo_Extraccion, Certificaciones, COA_URL
- **Uso:** Dosis_Recomendada, Modo_Empleo, Advertencias
- **Envío:** Peso_g, Alto_cm, Ancho_cm, Fondo_cm
- **Imágenes:** Imagen_Principal, Imagen_2, Imagen_3
- **Contenido web:** Descripcion_Corta, Descripcion_Larga, Palabras_Clave, Meta_Titulo, Meta_Descripcion, URL_Origen
- **Gestión:** Estado, Aviso_Legal, Notas_Internas

## Campos con lista desplegable

`Categoria`, `Espectro`, `Unidad_Medida`, `IVA_%`, `Moneda`, `Disponibilidad`, `Estado`
→ clic en la celda y elegir de la lista.

## Campos obligatorios

`ID`, `SKU`, `Nombre_Producto`, `Categoria`, `CBD_%`, `THC_%`, `Precio_Venta`,
`Disponibilidad`, `Descripcion_Corta`, `Estado`.

## Reglas rápidas

- Precios y números **sin símbolos** (ej. `38.00`). Decimales con punto o coma.
- `THC_%` debe ser **inferior a 0,2** (cáñamo legal en España).
- Fechas en formato **AAAA-MM-DD** (ej. `2026-12-31`).
- Imágenes: pon el **nombre del archivo** y súbelo a `public/products/`.
- Certificados/COA: enlace en `COA_URL`, o sube el PDF a `public/lab-pdfs/`.

## Cómo abrirlo

- **Excel:** doble clic en el `.xlsx` → hoja «Productos».
- **Google Sheets:** _Archivo → Importar → Subir_ el `.xlsx`. Al terminar, descárgalo
  de nuevo (_Archivo → Descargar → .xlsx_) antes de enviarlo.

## Cuando esté relleno

Envíame el archivo o pega su contenido y **genero el catálogo de la tienda**
(`lib/commerce/mock-data.ts`) con esos productos, listo para desplegar.

---

> El Excel se genera con `docs/_build_xlsx.py` (sin dependencias externas).
> Para regenerarlo: `python3 docs/_build_xlsx.py`.
