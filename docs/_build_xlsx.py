#!/usr/bin/env python3
"""
Genera docs/plantilla-productos.xlsx SIN dependencias externas.
Un .xlsx es un ZIP de partes XML (OOXML). Construimos las mínimas necesarias:
- dos hojas: "Instrucciones" y "Productos"
- estilos (cabeceras con color, texto envuelto)
- validaciones de datos (listas desplegables) para Categoria, Metodo, y etiquetas
- congelar la fila de cabecera y anchos de columna
Ejecutar: python3 docs/_build_xlsx.py
"""
import zipfile
from xml.sax.saxutils import escape

OUT = "docs/plantilla-productos.xlsx"

# ---------- Hoja "Productos": cabeceras + filas de ejemplo ----------
HEADERS = [
    "nombre", "categoria", "descripcion_corta", "descripcion_larga",
    "cbd_percent", "cbg_percent", "terpenos", "origen", "metodo",
    "variantes", "etiquetas", "imagen", "pdf_laboratorio", "disclaimer_especial",
]

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

INSTRUCCIONES = [
    ("PLANTILLA DE PRODUCTOS — The Best Dreams", "titulo"),
    ("", "normal"),
    ("Rellena la hoja «Productos»: UNA FILA POR PRODUCTO. No borres la fila de títulos.", "normal"),
    ("Las columnas «categoria» y «metodo» tienen lista desplegable: haz clic en la celda y elige.", "normal"),
    ("Hay 2 filas de ejemplo (2 y 3). Bórralas y escribe las tuyas, o avísame para ignorarlas.", "normal"),
    ("", "normal"),
    ("QUÉ VA EN CADA COLUMNA", "sub"),
    ("nombre — Nombre del producto. (Obligatorio)", "normal"),
    ("categoria — Elige de la lista: Flores CBD, Hachís y Extractos, Aceites CBD, Vaporizadores, Accesorios, Semillas CBD/CBG. (Obligatorio)", "normal"),
    ("descripcion_corta — Una frase, aparece en la tarjeta. (Obligatorio)", "normal"),
    ("descripcion_larga — 2 a 4 frases, aparece en la ficha. (Recomendado)", "normal"),
    ("cbd_percent — Número, % de CBD (ej. 12). Si no aplica, 0. (Obligatorio)", "normal"),
    ("cbg_percent — Número, % de CBG. Si no aplica, 0.", "normal"),
    ("terpenos — Lista separada por comas: Mirceno, Limoneno.", "normal"),
    ("origen — Ej. Cultivo propio en Algemesí (Valencia).", "normal"),
    ("metodo — Solo flores/extractos: interior/exterior/invernadero. En lo demás: no aplica.", "normal"),
    ("variantes — Tamaños y precios. MUY IMPORTANTE. Formato:  tamaño=precio=si|no  separados por  |", "normal"),
    ("            Ej:  1g=8.90=si | 3g=24.00=si | 5g=38.00=no    (aceites en ml: 10ml=29.90=si)", "normal"),
    ("            'si' = disponible, 'no' = agotado. Decimales con punto o coma. (Al menos una)", "normal"),
    ("etiquetas — Cualquiera de: nuevo, oferta, mas-vendido, agotado. Varias separadas por coma, o vacío.", "normal"),
    ("imagen — Nombre del archivo de foto propia (súbelo a public/products/). Vacío = imagen común.", "normal"),
    ("pdf_laboratorio — Nombre del PDF de análisis (súbelo a public/lab-pdfs/). Vacío = sin certificado.", "normal"),
    ("disclaimer_especial — Texto legal propio del producto. Vacío = uso el disclaimer legal por categoría.", "normal"),
    ("", "normal"),
    ("Cuando termines, envíame el archivo o pega su contenido y genero el catálogo de la tienda.", "normal"),
]

# ---------- Helpers OOXML ----------
def col_letter(idx):  # 0-based -> A, B, ...
    s = ""
    idx += 1
    while idx:
        idx, r = divmod(idx - 1, 26)
        s = chr(65 + r) + s
    return s

def cell(ref, text, style):
    return (f'<c r="{ref}" s="{style}" t="inlineStr">'
            f'<is><t xml:space="preserve">{escape(str(text))}</t></is></c>')

CONTENT_TYPES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
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
</Relationships>'''

# Styles: 0 normal, 1 header(gold bg+bold+wrap), 2 wrap, 3 title(bold big), 4 subtitle(bold)
STYLES = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FF0B0B0A"/><name val="Calibri"/></font>
<font><b/><sz val="16"/><color rgb="FF8A6D1B"/><name val="Calibri"/></font>
<font><b/><sz val="12"/><color rgb="FF8A6D1B"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFE8C572"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="5">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
</cellXfs>
</styleSheet>'''

def build_instrucciones():
    rows = []
    for i, (text, kind) in enumerate(INSTRUCCIONES, start=1):
        style = {"titulo": 3, "sub": 4}.get(kind, 0)
        rows.append(f'<row r="{i}">{cell("A"+str(i), text, style)}</row>')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetViews><sheetView workbookViewId="0"/></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols><col min="1" max="1" width="120" customWidth="1"/></cols>
<sheetData>{"".join(rows)}</sheetData>
</worksheet>'''

def build_productos():
    widths = [24, 18, 40, 55, 11, 11, 26, 34, 12, 46, 20, 18, 20, 45]
    cols = "".join(
        f'<col min="{i+1}" max="{i+1}" width="{w}" customWidth="1"/>'
        for i, w in enumerate(widths))
    rows = []
    # header
    hcells = "".join(cell(col_letter(c)+"1", h, 1) for c, h in enumerate(HEADERS))
    rows.append(f'<row r="1" ht="30" customHeight="1">{hcells}</row>')
    # examples
    for r, ex in enumerate(EXAMPLES, start=2):
        cs = "".join(cell(col_letter(c)+str(r), v, 2) for c, v in enumerate(ex))
        rows.append(f'<row r="{r}">{cs}</row>')
    # data validations: categoria = col B (2), metodo = col I (9); rows 2..500
    cat_list = escape(",".join(CATEGORIAS))
    met_list = escape(",".join(METODOS))
    dv = (f'<dataValidations count="2">'
          f'<dataValidation type="list" allowBlank="1" showDropDown="0" showInputMessage="1" showErrorMessage="1" sqref="B2:B500">'
          f'<formula1>"{cat_list}"</formula1></dataValidation>'
          f'<dataValidation type="list" allowBlank="1" showDropDown="0" showInputMessage="1" showErrorMessage="1" sqref="I2:I500">'
          f'<formula1>"{met_list}"</formula1></dataValidation>'
          f'</dataValidations>')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols>{cols}</cols>
<sheetData>{"".join(rows)}</sheetData>
{dv}
</worksheet>'''

def main():
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", CONTENT_TYPES)
        z.writestr("_rels/.rels", ROOT_RELS)
        z.writestr("xl/workbook.xml", WORKBOOK)
        z.writestr("xl/_rels/workbook.xml.rels", WORKBOOK_RELS)
        z.writestr("xl/styles.xml", STYLES)
        z.writestr("xl/worksheets/sheet1.xml", build_instrucciones())
        z.writestr("xl/worksheets/sheet2.xml", build_productos())
    print("wrote", OUT)

if __name__ == "__main__":
    main()
