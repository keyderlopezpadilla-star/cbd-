#!/usr/bin/env python3
"""
Genera docs/plantilla-productos.xlsx SIN dependencias externas.

Un .xlsx es un ZIP de partes XML (OOXML). Se construyen las partes mínimas y se
usa una TABLA DE CADENAS COMPARTIDAS (sharedStrings.xml), que es la forma estándar
de Excel y la más compatible con Excel, LibreOffice y Google Sheets (evita que la
fila de títulos u otras celdas de texto "desaparezcan" en algunos visores).

Hojas:
  1) "Instrucciones": guía completa para el cliente.
  2) "Productos": cabeceras con color + validaciones desplegables + ejemplos.

Ejecutar:  python3 docs/_build_xlsx.py
"""
import zipfile
from xml.sax.saxutils import escape

OUT = "docs/plantilla-productos.xlsx"

# ---------- Definición de columnas (hoja Productos) ----------
HEADERS = [
    "nombre", "categoria", "descripcion_corta", "descripcion_larga",
    "cbd_percent", "cbg_percent", "terpenos", "origen", "metodo",
    "variantes", "etiquetas", "imagen", "pdf_laboratorio", "disclaimer_especial",
]
WIDTHS = [24, 20, 40, 55, 12, 12, 26, 34, 14, 48, 22, 20, 22, 45]

EXAMPLES = [
    ["Amnesia Haze Interior", "Flores CBD",
     "Cogollo de interior con aroma cítrico intenso y resina abundante.",
     "Cultivada en interior con control de clima y curado lento. Perfil terpénico marcado y flor compacta de alta calidad.",
     "12", "0", "Mirceno, Limoneno, Terpinoleno",
     "Cultivo propio en Algemesí (Valencia)", "interior",
     "1g=8.90=si | 3g=24.00=si | 5g=38.00=si | 10g=70.00=no",
     "nuevo, mas-vendido", "", "amnesia-haze.pdf", ""],
    ["Aceite Full Spectrum 10%", "Aceites CBD",
     "Aceite de espectro completo con base de MCT y pipeta graduada.",
     "Formulado en frío para preservar cannabinoides y terpenos. Dosificación precisa gota a gota.",
     "10", "2", "Betacariofileno, Linalool",
     "Elaboración propia en Carcaixent (Valencia)", "no aplica",
     "10ml=29.90=si | 30ml=69.90=si", "oferta", "", "aceite-full-10.pdf",
     "Complemento de bienestar de uso tópico. No sustituye ningún tratamiento médico."],
]

CATEGORIAS = ["Flores CBD", "Hachís y Extractos", "Aceites CBD",
              "Vaporizadores", "Accesorios", "Semillas CBD/CBG"]
METODOS = ["interior", "exterior", "invernadero", "no aplica"]

# ---------- Hoja Instrucciones (texto, estilo por línea) ----------
# kind: titulo / sub / normal / bullet
INSTR = [
    ("Plantilla de productos — The Best Dreams", "titulo"),
    ("", "normal"),
    ("Rellena la hoja «Productos»: UNA FILA POR PRODUCTO. No borres la fila de títulos (fila 1).", "normal"),
    ("Las columnas «categoria» y «metodo» tienen lista desplegable: haz clic en la celda y elige una opción.", "normal"),
    ("La hoja «Productos» trae 2 filas de EJEMPLO (filas 2 y 3). Bórralas y escribe las tuyas.", "normal"),
    ("", "normal"),
    ("QUÉ VA EN CADA COLUMNA", "sub"),
    ("nombre  ·  Nombre del producto.  (OBLIGATORIO)", "bullet"),
    ("categoria  ·  Elige de la lista: Flores CBD / Hachís y Extractos / Aceites CBD / Vaporizadores / Accesorios / Semillas CBD/CBG.  (OBLIGATORIO)", "bullet"),
    ("descripcion_corta  ·  Una frase; aparece en la tarjeta del producto.  (OBLIGATORIO)", "bullet"),
    ("descripcion_larga  ·  2 a 4 frases; aparece en la ficha del producto.  (Recomendado)", "bullet"),
    ("cbd_percent  ·  Número, % de CBD (ej. 12). Si no aplica, escribe 0.  (OBLIGATORIO)", "bullet"),
    ("cbg_percent  ·  Número, % de CBG. Si no aplica, escribe 0.", "bullet"),
    ("terpenos  ·  Lista separada por comas: Mirceno, Limoneno, Pineno.", "bullet"),
    ("origen  ·  Ej.: Cultivo propio en Algemesí (Valencia).", "bullet"),
    ("metodo  ·  Solo flores/extractos: interior / exterior / invernadero. En lo demás: no aplica.", "bullet"),
    ("variantes  ·  Tamaños y precios. LA COLUMNA MÁS IMPORTANTE.  (OBLIGATORIO, al menos una)", "bullet"),
    ("            Formato:  tamaño=precio=si|no   y varias separadas por la barra  |", "normal"),
    ("            Ejemplo flores:   1g=8.90=si | 3g=24.00=si | 5g=38.00=no", "normal"),
    ("            Ejemplo aceites:  10ml=29.90=si | 30ml=69.90=si", "normal"),
    ("            'si' = disponible, 'no' = agotado. Decimales con punto o coma (yo los normalizo).", "normal"),
    ("etiquetas  ·  Cualquiera de: nuevo / oferta / mas-vendido / agotado. Varias separadas por coma, o vacío.", "bullet"),
    ("imagen  ·  Nombre del archivo de foto propia (súbelo a public/products/). Vacío = se usa la imagen común.", "bullet"),
    ("pdf_laboratorio  ·  Nombre del PDF de análisis (súbelo a public/lab-pdfs/). Vacío = sin certificado.", "bullet"),
    ("disclaimer_especial  ·  Texto legal propio del producto. Vacío = se usa el disclaimer legal por categoría.", "bullet"),
    ("", "normal"),
    ("CONSEJOS", "sub"),
    ("Puedes copiar y pegar filas para ir más rápido; solo cambia los valores.", "bullet"),
    ("Escribe los precios sin el símbolo €; solo el número (ej. 24.00).", "bullet"),
    ("Si un producto está totalmente agotado, pon 'no' en todas sus variantes y añade la etiqueta 'agotado'.", "bullet"),
    ("", "normal"),
    ("Cuando termines, envíame el archivo o pega el contenido y genero el catálogo de la tienda.", "normal"),
]

# ---------- Tabla de cadenas compartidas ----------
_shared = []
_shared_idx = {}
def s(text):
    text = "" if text is None else str(text)
    if text not in _shared_idx:
        _shared_idx[text] = len(_shared)
        _shared.append(text)
    return _shared_idx[text]

def col_letter(idx):  # 0-based -> A, B, ...
    out = ""; idx += 1
    while idx:
        idx, r = divmod(idx - 1, 26)
        out = chr(65 + r) + out
    return out

def scell(ref, text, style):  # shared-string cell
    return f'<c r="{ref}" s="{style}" t="s"><v>{s(text)}</v></c>'

# ---------- Partes fijas ----------
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
<sheets>
<sheet name="Instrucciones" sheetId="1" r:id="rId1"/>
<sheet name="Productos" sheetId="2" r:id="rId2"/>
</sheets>
</workbook>'''

WORKBOOK_RELS = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>'''

# Estilos: 0 normal(wrap,top) · 1 header(dorado+bold+centrado+wrap) ·
#          2 celda(wrap,top) · 3 título(grande) · 4 subtítulo · 5 texto normal instrucciones
STYLES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FF0B0B0A"/><name val="Calibri"/></font>
<font><b/><sz val="18"/><color rgb="FF8A6D1B"/><name val="Calibri"/></font>
<font><b/><sz val="13"/><color rgb="FF8A6D1B"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFE8C572"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="6">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
</cellXfs>
</styleSheet>'''

def build_instrucciones():
    rows = []
    for i, (text, kind) in enumerate(INSTR, start=1):
        style = {"titulo": 3, "sub": 4}.get(kind, 5)
        rows.append(f'<row r="{i}">{scell("A"+str(i), text, style)}</row>')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetViews><sheetView workbookViewId="0"/></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols><col min="1" max="1" width="130" customWidth="1"/></cols>
<sheetData>{"".join(rows)}</sheetData>
</worksheet>'''

def build_productos():
    cols = "".join(
        f'<col min="{i+1}" max="{i+1}" width="{w}" customWidth="1"/>'
        for i, w in enumerate(WIDTHS))
    rows = []
    hcells = "".join(scell(col_letter(c)+"1", h, 1) for c, h in enumerate(HEADERS))
    rows.append(f'<row r="1" ht="30" customHeight="1">{hcells}</row>')
    for r, ex in enumerate(EXAMPLES, start=2):
        cs = "".join(scell(col_letter(c)+str(r), v, 2) for c, v in enumerate(ex))
        rows.append(f'<row r="{r}">{cs}</row>')
    last_col = col_letter(len(HEADERS) - 1)
    cat_list = escape(",".join(CATEGORIAS))
    met_list = escape(",".join(METODOS))
    dv = (f'<dataValidations count="2">'
          f'<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" sqref="B2:B1000">'
          f'<formula1>"{cat_list}"</formula1></dataValidation>'
          f'<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" sqref="I2:I1000">'
          f'<formula1>"{met_list}"</formula1></dataValidation>'
          f'</dataValidations>')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols>{cols}</cols>
<sheetData>{"".join(rows)}</sheetData>
<autoFilter ref="A1:{last_col}1"/>
{dv}
</worksheet>'''

def build_shared_strings():
    items = "".join(
        f'<si><t xml:space="preserve">{escape(v)}</t></si>' for v in _shared)
    return (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            f'count="{len(_shared)}" uniqueCount="{len(_shared)}">{items}</sst>')

def main():
    sheet1 = build_instrucciones()   # populates shared strings
    sheet2 = build_productos()       # populates shared strings
    sst = build_shared_strings()     # must be built AFTER the sheets
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", ROOT_RELS)
        z.writestr("xl/workbook.xml", WORKBOOK)
        z.writestr("xl/_rels/workbook.xml.rels", WORKBOOK_RELS)
        z.writestr("xl/styles.xml", STYLES)
        z.writestr("xl/sharedStrings.xml", sst)
        z.writestr("xl/worksheets/sheet1.xml", sheet1)
        z.writestr("xl/worksheets/sheet2.xml", sheet2)
    print("wrote", OUT, "| shared strings:", len(_shared))

if __name__ == "__main__":
    main()
