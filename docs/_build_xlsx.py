#!/usr/bin/env python3
"""
Genera docs/plantilla-productos.xlsx SIN dependencias externas.

Un .xlsx es un ZIP de partes XML (OOXML). Se usan cadenas compartidas
(sharedStrings.xml), la forma estándar de Excel, para máxima compatibilidad con
Excel, LibreOffice y Google Sheets.

Hojas:
  1) "Instrucciones": guía completa para el cliente.
  2) "Productos": fila 1 = grupos de sección (con color), fila 2 = títulos de
     campo (congelada + autofiltro), fila 3 = ejemplo. Desplegables en los
     campos de lista cerrada.

Ejecutar:  python3 docs/_build_xlsx.py
"""
import zipfile
from xml.sax.saxutils import escape

OUT = "docs/plantilla-productos.xlsx"

# ---------- Definición de campos por sección ----------
# (Título de sección, [(campo, ancho, descripción, obligatorio)])
SECTIONS = [
    ("Identificación", [
        ("ID", 10, "Identificador interno único (número o código).", True),
        ("SKU", 16, "Referencia interna de almacén.", True),
        ("EAN", 16, "Código de barras EAN-13 (si tiene).", False),
        ("Nombre_Producto", 26, "Nombre comercial del producto.", True),
        ("Marca", 16, "Marca (ej. The Best Dreams).", False),
        ("Proveedor", 18, "Proveedor o fabricante.", False),
        ("Categoria", 20, "Lista: Flores CBD / Hachís y Extractos / Aceites CBD / Vaporizadores / Accesorios / Semillas CBD/CBG.", True),
        ("Subcategoria", 18, "Ej.: Interior, Exterior, Invernadero, Full Spectrum...", False),
        ("Formato", 16, "Ej.: 5g, 10ml, 1 unidad.", False),
    ]),
    ("Cannabinoides", [
        ("Espectro", 16, "Lista: Full Spectrum / Broad Spectrum / Aislado / No aplica.", False),
        ("CBD_mg", 12, "Miligramos de CBD por unidad.", False),
        ("CBD_%", 10, "Porcentaje de CBD.", True),
        ("THC_%", 10, "Porcentaje de THC (debe ser < 0,2 en España).", True),
        ("Otros_Cannabinoides", 24, "Ej.: CBG 2%, CBN 0,5%.", False),
    ]),
    ("Producto", [
        ("Contenido_Neto", 14, "Cantidad por unidad (número).", False),
        ("Unidad_Medida", 14, "Lista: g / ml / unidades.", False),
        ("Ingredientes", 34, "Lista de ingredientes.", False),
        ("Aceite_Portador", 18, "Ej.: MCT, oliva virgen extra.", False),
        ("Sabor_Aroma", 18, "Ej.: Natural, Menta, Cítrico.", False),
    ]),
    ("Precios", [
        ("Precio_Venta", 12, "Precio de venta al público (sin €).", True),
        ("Precio_Oferta", 12, "Precio rebajado (vacío si no hay oferta).", False),
        ("Precio_Coste", 12, "Coste (uso interno).", False),
        ("IVA_%", 10, "Lista: 21 / 10 / 4 / 0.", False),
        ("Moneda", 10, "Lista: EUR / USD.", False),
    ]),
    ("Stock", [
        ("Stock", 10, "Unidades disponibles (número).", False),
        ("Stock_Minimo", 12, "Umbral de aviso de reposición.", False),
        ("Disponibilidad", 16, "Lista: Disponible / Agotado / Bajo pedido / Descatalogado.", True),
    ]),
    ("Trazabilidad", [
        ("Lote", 14, "Número de lote.", False),
        ("Fecha_Caducidad", 16, "Formato AAAA-MM-DD.", False),
        ("Origen_Cañamo", 22, "País/región de origen del cáñamo.", False),
        ("Metodo_Extraccion", 20, "Ej.: CO2, etanol, prensado en frío.", False),
        ("Certificaciones", 22, "Ej.: EU, ISO, ecológico.", False),
        ("COA_URL", 24, "Enlace al certificado de análisis (COA/PDF).", False),
    ]),
    ("Uso", [
        ("Dosis_Recomendada", 20, "Ej.: 2-3 gotas, 2 veces al día.", False),
        ("Modo_Empleo", 26, "Cómo usar el producto.", False),
        ("Advertencias", 30, "Advertencias de uso.", False),
    ]),
    ("Envío", [
        ("Peso_g", 10, "Peso del paquete en gramos.", False),
        ("Alto_cm", 10, "Alto del embalaje (cm).", False),
        ("Ancho_cm", 10, "Ancho del embalaje (cm).", False),
        ("Fondo_cm", 10, "Fondo del embalaje (cm).", False),
    ]),
    ("Imágenes", [
        ("Imagen_Principal", 22, "Nombre de archivo o URL (a subir a public/products/).", False),
        ("Imagen_2", 18, "Imagen secundaria.", False),
        ("Imagen_3", 18, "Imagen secundaria.", False),
    ]),
    ("Contenido web", [
        ("Descripcion_Corta", 40, "Una frase; aparece en la tarjeta.", True),
        ("Descripcion_Larga", 55, "2-4 frases; aparece en la ficha.", False),
        ("Palabras_Clave", 26, "Keywords SEO separadas por comas.", False),
        ("Meta_Titulo", 26, "Título SEO (<=60 caracteres).", False),
        ("Meta_Descripcion", 40, "Descripción SEO (<=155 caracteres).", False),
        ("URL_Origen", 22, "URL o slug de la ficha.", False),
    ]),
    ("Gestión", [
        ("Estado", 14, "Lista: Publicado / Borrador / Oculto.", True),
        ("Aviso_Legal", 40, "Disclaimer legal específico del producto.", False),
        ("Notas_Internas", 30, "Notas de uso interno (no se publican).", False),
    ]),
]

# Colores por sección (para la fila de grupo)
SECTION_COLORS = [
    "FFE8C572", "FFCDE0B0", "FFB7D9C8", "FFF3C9A0", "FFC9B8E0",
    "FFE0C0B0", "FFB0CCE0", "FFD8D8B0", "FFC0D8D8", "FFE0B0C8", "FFCFCFCF",
]

# Desplegables: campo -> opciones
DROPDOWNS = {
    "Categoria": ["Flores CBD", "Hachís y Extractos", "Aceites CBD", "Vaporizadores", "Accesorios", "Semillas CBD/CBG"],
    "Espectro": ["Full Spectrum", "Broad Spectrum", "Aislado", "No aplica"],
    "Unidad_Medida": ["g", "ml", "unidades"],
    "IVA_%": ["21", "10", "4", "0"],
    "Moneda": ["EUR", "USD"],
    "Disponibilidad": ["Disponible", "Agotado", "Bajo pedido", "Descatalogado"],
    "Estado": ["Publicado", "Borrador", "Oculto"],
}

# Fila de ejemplo (por nombre de campo)
EXAMPLE = {
    "ID": "1", "SKU": "TBD-FL-AMN-5G", "EAN": "8412345678901",
    "Nombre_Producto": "Amnesia Haze Interior", "Marca": "The Best Dreams",
    "Proveedor": "Cultivo propio", "Categoria": "Flores CBD",
    "Subcategoria": "Interior", "Formato": "5g",
    "Espectro": "Full Spectrum", "CBD_mg": "600", "CBD_%": "12", "THC_%": "0.15",
    "Otros_Cannabinoides": "CBG 1%",
    "Contenido_Neto": "5", "Unidad_Medida": "g",
    "Ingredientes": "Flor de cáñamo CBD", "Aceite_Portador": "", "Sabor_Aroma": "Cítrico",
    "Precio_Venta": "38.00", "Precio_Oferta": "", "Precio_Coste": "18.00",
    "IVA_%": "21", "Moneda": "EUR",
    "Stock": "120", "Stock_Minimo": "10", "Disponibilidad": "Disponible",
    "Lote": "L-2024-014", "Fecha_Caducidad": "2026-12-31",
    "Origen_Cañamo": "España (Valencia)", "Metodo_Extraccion": "No aplica",
    "Certificaciones": "EU certificado", "COA_URL": "https://ejemplo.com/coa/amnesia.pdf",
    "Dosis_Recomendada": "Uso ornamental", "Modo_Empleo": "Producto de coleccionismo aromático.",
    "Advertencias": "No apto para consumo humano por combustión.",
    "Peso_g": "20", "Alto_cm": "12", "Ancho_cm": "8", "Fondo_cm": "2",
    "Imagen_Principal": "amnesia-haze.jpg", "Imagen_2": "", "Imagen_3": "",
    "Descripcion_Corta": "Cogollo de interior con aroma cítrico intenso y resina abundante.",
    "Descripcion_Larga": "Cultivada en interior con control de clima y curado lento. Perfil terpénico marcado y flor compacta de alta calidad.",
    "Palabras_Clave": "flor cbd, amnesia haze, interior",
    "Meta_Titulo": "Amnesia Haze Interior CBD | The Best Dreams",
    "Meta_Descripcion": "Flor de CBD de interior, aroma cítrico y resina abundante. Cáñamo legal <0,2% THC.",
    "URL_Origen": "amnesia-haze-interior",
    "Estado": "Publicado",
    "Aviso_Legal": "Cáñamo industrial legal en España con menos del 0,2% de THC.",
    "Notas_Internas": "Cosecha primavera 2024.",
}

# ---------- Instrucciones ----------
INSTR = [
    ("Plantilla de productos — The Best Dreams", "titulo"),
    ("", "n"),
    ("Rellena la hoja «Productos»: UNA FILA POR PRODUCTO, a partir de la fila 3.", "n"),
    ("Fila 1 = grupos de sección (color). Fila 2 = títulos de campo (no la borres). Fila 3 = EJEMPLO: bórrala y escribe los tuyos.", "n"),
    ("Los campos con lista desplegable: Categoria, Espectro, Unidad_Medida, IVA_%, Moneda, Disponibilidad, Estado. Haz clic y elige.", "n"),
    ("", "n"),
    ("CAMPOS OBLIGATORIOS", "sub"),
    ("ID, SKU, Nombre_Producto, Categoria, CBD_%, THC_%, Precio_Venta, Disponibilidad, Descripcion_Corta, Estado.", "n"),
    ("", "n"),
    ("SECCIONES Y CAMPOS", "sub"),
]
for _title, _fields in SECTIONS:
    INSTR.append((_title.upper(), "sub2"))
    for _name, _w, _desc, _req in _fields:
        tag = "  (OBLIGATORIO)" if _req else ""
        INSTR.append((f"{_name}  ·  {_desc}{tag}", "b"))
    INSTR.append(("", "n"))
INSTR += [
    ("NOTAS", "sub"),
    ("Precios y números sin símbolos (ej. 38.00). Decimales con punto o coma.", "b"),
    ("THC_% debe ser inferior a 0,2 (cáñamo legal en España).", "b"),
    ("Fechas en formato AAAA-MM-DD (ej. 2026-12-31).", "b"),
    ("Puedes copiar y pegar filas para ir más rápido; solo cambia los valores.", "b"),
    ("", "n"),
    ("Cuando termines, envíame el archivo o pega el contenido y genero el catálogo de la tienda.", "n"),
]

# ---------- Shared strings ----------
_shared, _idx = [], {}
def s(text):
    text = "" if text is None else str(text)
    if text not in _idx:
        _idx[text] = len(_shared); _shared.append(text)
    return _idx[text]

def col_letter(i):
    out = ""; i += 1
    while i:
        i, r = divmod(i - 1, 26); out = chr(65 + r) + out
    return out

def sc(ref, text, style):
    return f'<c r="{ref}" s="{style}" t="s"><v>{s(text)}</v></c>'

# Flatten fields
FLAT = [(name, w, req) for _t, fs in SECTIONS for (name, w, _d, req) in fs]
FIELD_NAMES = [f[0] for f in FLAT]

# ---------- Fixed parts ----------
CONTENT_TYPES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>'''

ROOT_RELS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''

WORKBOOK = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Instrucciones" sheetId="1" r:id="rId1"/><sheet name="Productos" sheetId="2" r:id="rId2"/></sheets>
</workbook>'''

WORKBOOK_RELS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>'''

# Styles indices:
# 0 normal(wrap,top) | 1 field-header(gold bold center wrap) | 2 cell(wrap,top)
# 3 title | 4 subtitle | 5 sub2 | 6 plain
# 7..7+N section-group headers (one fill per section color)
def build_styles():
    section_fills = "".join(
        f'<fill><patternFill patternType="solid"><fgColor rgb="{c}"/><bgColor indexed="64"/></patternFill></fill>'
        for c in SECTION_COLORS)
    section_xfs = "".join(
        f'<xf numFmtId="0" fontId="1" fillId="{3+i}" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'
        for i in range(len(SECTION_COLORS)))
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="5">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FF0B0B0A"/><name val="Calibri"/></font>
<font><b/><sz val="18"/><color rgb="FF8A6D1B"/><name val="Calibri"/></font>
<font><b/><sz val="13"/><color rgb="FF8A6D1B"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FF3E4B34"/><name val="Calibri"/></font>
</fonts>
<fills count="{3+len(SECTION_COLORS)}">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFE8C572"/><bgColor indexed="64"/></patternFill></fill>
{section_fills}
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="{7+len(SECTION_COLORS)}">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
{section_xfs}
</cellXfs>
</styleSheet>'''

def build_instrucciones():
    rows = []
    style_map = {"titulo": 3, "sub": 4, "sub2": 5, "b": 6, "n": 6}
    for i, (text, kind) in enumerate(INSTR, start=1):
        rows.append(f'<row r="{i}">{sc("A"+str(i), text, style_map.get(kind,6))}</row>')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetViews><sheetView workbookViewId="0"/></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols><col min="1" max="1" width="135" customWidth="1"/></cols>
<sheetData>{"".join(rows)}</sheetData>
</worksheet>'''

def build_productos():
    cols = "".join(
        f'<col min="{i+1}" max="{i+1}" width="{w}" customWidth="1"/>'
        for i, (_n, w, _r) in enumerate(FLAT))
    # Row 1: section groups (merged across their fields)
    merges = []
    r1 = []
    c = 0
    for si, (title, fields) in enumerate(SECTIONS):
        start = c
        end = c + len(fields) - 1
        style = 7 + (si % len(SECTION_COLORS))
        r1.append(sc(col_letter(start) + "1", title, style))
        # fill the rest of the merged cells with empty styled cells
        for k in range(start + 1, end + 1):
            r1.append(f'<c r="{col_letter(k)}1" s="{style}"/>')
        if end > start:
            merges.append(f'{col_letter(start)}1:{col_letter(end)}1')
        c = end + 1
    row1 = f'<row r="1" ht="20" customHeight="1">{"".join(r1)}</row>'
    # Row 2: field headers
    r2 = "".join(sc(col_letter(i) + "2", name, 1) for i, name in enumerate(FIELD_NAMES))
    row2 = f'<row r="2" ht="28" customHeight="1">{r2}</row>'
    # Row 3: example
    r3 = "".join(sc(col_letter(i) + "3", EXAMPLE.get(name, ""), 2) for i, name in enumerate(FIELD_NAMES))
    row3 = f'<row r="3">{r3}</row>'
    last_col = col_letter(len(FIELD_NAMES) - 1)
    merge_xml = (f'<mergeCells count="{len(merges)}">'
                 + "".join(f'<mergeCell ref="{m}"/>' for m in merges)
                 + '</mergeCells>')
    # Data validations for dropdown fields (rows 3..1000)
    dvs = []
    for name, opts in DROPDOWNS.items():
        col = col_letter(FIELD_NAMES.index(name))
        lst = escape(",".join(opts))
        dvs.append(f'<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" '
                   f'sqref="{col}3:{col}1000"><formula1>"{lst}"</formula1></dataValidation>')
    dv = f'<dataValidations count="{len(dvs)}">' + "".join(dvs) + '</dataValidations>'
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A3" sqref="A3"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols>{cols}</cols>
<sheetData>{row1}{row2}{row3}</sheetData>
{merge_xml}
<autoFilter ref="A2:{last_col}2"/>
{dv}
</worksheet>'''

def build_shared_strings():
    items = "".join(f'<si><t xml:space="preserve">{escape(v)}</t></si>' for v in _shared)
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            f'count="{len(_shared)}" uniqueCount="{len(_shared)}">{items}</sst>')

def main():
    styles = build_styles()
    sheet1 = build_instrucciones()
    sheet2 = build_productos()
    sst = build_shared_strings()
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", ROOT_RELS)
        z.writestr("xl/workbook.xml", WORKBOOK)
        z.writestr("xl/_rels/workbook.xml.rels", WORKBOOK_RELS)
        z.writestr("xl/styles.xml", styles)
        z.writestr("xl/sharedStrings.xml", sst)
        z.writestr("xl/worksheets/sheet1.xml", sheet1)
        z.writestr("xl/worksheets/sheet2.xml", sheet2)
    print("wrote", OUT, "| fields:", len(FLAT), "| sections:", len(SECTIONS), "| shared strings:", len(_shared))

if __name__ == "__main__":
    main()
