#!/usr/bin/env node
// ============================================================================
//  scrape-precios.mjs — actualiza web/public/precios.json
// ----------------------------------------------------------------------------
//  Sin dependencias (Node 18+: fetch nativo + regex). Pensado para correr en
//  CI (GitHub Actions) o a mano con `npm run scrape`.
//
//  Qué actualiza de forma AUTOMÁTICA y confiable:

//    • INMAG      → tabla HTML dedicada haciinfo000013 (MAG, misma URL base)
//    • Invernada  → API pública de ROSGAN (api.rosgannet.com.ar/precios_fede)
//    • Cría       → API pública de ROSGAN (misma URL, tipos[cría])
//    • Gordo   → tabla HTML del Mercado Agroganadero de Cañuelas (MAG)
//    • Granos  → pizarra de la Cámara Arbitral de Cereales (BCR Rosario)
//    • Monedas → dolarito.ar (dólar/euro/real, compra y venta)

//
//  Qué PRESERVA del archivo anterior (fuente inestable o protegida):
//    • Ninguno en modo normal. Si una fuente falla, se conserva el bloque previo.
//
//  Resiliencia: cada fuente corre en su propio try/catch. Si una falla, se
//  conserva el bloque anterior. La variación % se calcula contra el snapshot
//  previo (por eso recién aparece a partir de la 2ª corrida).
// ============================================================================

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "precios.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const TIMEOUT_MS = 25000;

// ---------------------------------------------------------------------------
//  Utilidades
// ---------------------------------------------------------------------------

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "es-AR,es;q=0.9" },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

/** GET + JSON.parse, para APIs que devuelven JSON (dolarapi, open.er-api). */
async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

/** Parsea un número en formato es-AR ("3.855,90" / "4757,511" / "$465.000"). */
function num(s) {
  if (s == null) return null;
  const cleaned = String(s).replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Quita tags y decodifica las pocas entidades que aparecen. */
function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&iacute;/g, "í")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

/** Fecha de hoy (YYYY-MM-DD) en horario de Argentina. */
function todayAR() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const MESES = {
  enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06",
  julio: "07", agosto: "08", septiembre: "09", setiembre: "09", octubre: "10",
  noviembre: "11", diciembre: "12",
};

/** "martes 2 de junio de 2026" -> "2026-06-02" (o null). */
function fechaTextoAIso(texto) {
  const m = texto
    .toLowerCase()
    .match(/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+de\s+(\d{4})/);
  if (!m) return null;
  const d = m[1].padStart(2, "0");
  const mes = MESES[m[2]];
  return mes ? `${m[3]}-${mes}-${d}` : null;
}

/** Variación % de `actual` vs `previo` (1 decimal) o null. */
function variacion(actual, previo) {
  if (actual == null || previo == null || previo === 0) return null;
  return Math.round(((actual - previo) / previo) * 1000) / 10;
}

// ---------------------------------------------------------------------------
//  Fuente: Gordo (MAG Cañuelas)
// ---------------------------------------------------------------------------

const MAG_URL = "https://www.mercadoagroganadero.com.ar/dll/hacienda1.dll/haciinfo000002";

// Etiqueta exacta en la tabla del MAG -> nombre que mostramos.
const MAG_MAP = [
  { nombre: "Novillo EyB 431-460",      match: "NOVILLOS Mest.EyB 431/460" },
  { nombre: "Novillo EyB 461-490",      match: "NOVILLOS Mest.EyB 461/490" },
  { nombre: "Novillo EyB 491-520",      match: "NOVILLOS Mest.EyB 491/520" },
  { nombre: "Novillo EyB +520",         match: "NOVILLOS Mest.EyB + 520" },
  { nombre: "Novillo liviano",          match: "NOVILLOS Regulares Liv" },
  { nombre: "Novillo pesado",           match: "NOVILLOS Regulares Pes" },
  { nombre: "Novillo overo",            match: "NOVILLOS Overos N" },
  { nombre: "Novillito EyB liviano",    match: "NOVILLITOS EyB M. 300/390" },
  { nombre: "Novillito EyB pesado",     match: "NOVILLITOS EyB P. 391/430" },
  { nombre: "Novillito",               match: "NOVILLITOS Regulares" },
  { nombre: "Vaquillona EyB liviana",   match: "VAQUILLONAS EyB M.270/390" },
  { nombre: "Vaquillona EyB pesada",    match: "VAQUILLONAS EyB P.391/430" },
  { nombre: "Vaquillona",              match: "VAQUILLONAS Regulares" },
  { nombre: "Vaca buena",              match: "VACAS Buenas" },
  { nombre: "Vaca regular",            match: "VACAS Regulares" },
  { nombre: "Vaca conserva",           match: "VACAS Conserva Buena" },
  { nombre: "Vaca conserva inferior",  match: "VACAS Conserva Inferior" },
  { nombre: "Toro",                    match: "TOROS Buenos" },
  { nombre: "Toro regular",            match: "TOROS Regulares" },
  { nombre: "MEJ EyB",                 match: "MEJ EyB" },
  { nombre: "MEJ regular",             match: "MEJ Regulares" },
];

// Fuente secundaria: haciinfo000225 tiene datos correctos para novillito y vaquillona.
// Columnas: Categoría | Raza (vacío) | Máximo | Mínimo | Promedio | Mediana | ...
// SOURCE: https://www.mercadoagroganadero.com.ar/dll/hacienda6.dll/haciinfo000225
const MAG_225_URL = "https://www.mercadoagroganadero.com.ar/dll/hacienda6.dll/haciinfo000225";
const MAG_225_MAP = [
  { nombre: "Novillito", match: "NOVILLITOS" },
  { nombre: "Vaquillona", match: "VAQUILLONAS" },
];

/** Dada una etiqueta, toma los 3 primeros TD numéricos (mín, máx, promedio). */
function magFila(html, label) {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `${esc}[^<]*</TD>\\s*<TD[^>]*>([\\d.,]+)</TD>\\s*<TD[^>]*>([\\d.,]+)</TD>\\s*<TD[^>]*>([\\d.,]+)</TD>`,
    "i"
  );
  const m = html.match(re);
  if (!m) return null;
  return { min: num(m[1]), max: num(m[2]), prom: num(m[3]) };
}

/**
 * Igual que magFila pero para haciinfo000225, cuyo orden de columnas es
 * Categoría | Raza (vacío) | Máximo | Mínimo | Promedio | Mediana | ...
 * El TD de raza puede estar vacío o ausente, por eso es opcional.
 */
function magFila225(html, label) {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `${esc}[^<]*</TD>\\s*(?:<TD[^>]*>[^<]*</TD>\\s*)?<TD[^>]*>([\\d.,]+)</TD>\\s*<TD[^>]*>([\\d.,]+)</TD>\\s*<TD[^>]*>([\\d.,]+)</TD>`,
    "i"
  );
  const m = html.match(re);
  if (!m) return null;
  // Orden en haciinfo000225: max, min, prom
  return { max: num(m[1]), min: num(m[2]), prom: num(m[3]) };
}

// SOURCE: https://www.mercadoagroganadero.com.ar/dll/hacienda2.dll/haciinfo000013 | returns: HTML table with "Indice Arrendamiento" (INMAG)
const MAG_INMAG_URL = "https://www.mercadoagroganadero.com.ar/dll/hacienda2.dll/haciinfo000013";

async function scrapeGordo(prev) {
  const html = await fetchText(MAG_URL);
  const categorias = [];
  for (const c of MAG_MAP) {
    const f = magFila(html, c.match);
    if (f && f.prom != null) {
      categorias.push({ nombre: c.nombre, min: f.min, max: f.max, prom: f.prom, variacion: null });
    }
  }
  if (!categorias.length) throw new Error("MAG: no se parseó ninguna categoría");

  // Override novillito y vaquillona con datos de haciinfo000225 (fuente más precisa).
  try {
    const html225 = await fetchText(MAG_225_URL);
    for (const c of MAG_225_MAP) {
      const f = magFila225(html225, c.match);
      if (f && f.prom != null) {
        const idx = categorias.findIndex((cat) => cat.nombre === c.nombre);
        const cat = { nombre: c.nombre, min: f.min, max: f.max, prom: f.prom, variacion: null };
        if (idx >= 0) categorias[idx] = cat;
        else categorias.push(cat);
        console.log(`  ✓ ${c.nombre} (haciinfo000225): min=${f.min} max=${f.max} prom=${f.prom}`);
      }
    }
  } catch (e) {
    console.warn(`  ! haciinfo000225 falló (${e.message}). Se conservan valores de haciinfo000002.`);
  }

  const fecha = fechaTextoAIso(stripHtml(html)) || todayAR();

  // INMAG: scrapeado directamente desde haciinfo000013 (tabla dedicada al índice).
  // Recon confirmó que NO existe fila "NOVILLOS Especiales" en haciinfo000002,
  // por lo que se usa la fuente directa en lugar del proxy de promedio de novillos.
  let indice = prev?.indice ?? undefined;
  try {
    const inmagHtml = await fetchText(MAG_INMAG_URL);
    // La tabla tiene filas <TR> con 4 columnas: fecha | descripción | día | Indice Arrendamiento.
    // Se busca el primer valor numérico con formato argentino (7 dígitos con puntos y coma) en la 4ª columna.
    // Ejemplo de fila: <TD Align="Center">4.089,815</TD>
    const inmagMatch = inmagHtml.match(
      /<TR[^>]*>\s*<TD[^>]*>[^<]*<\/TD>\s*<TD[^>]*>[^<]*<\/TD>\s*<TD[^>]*>[^<]*<\/TD>\s*<TD[^>]*Align\s*=\s*["']?Center["']?[^>]*>([\d.]+,\d+)<\/TD>/i
    );
    if (inmagMatch) {
      const inmagVal = num(inmagMatch[1]);
      if (inmagVal != null) {
        indice = {
          sigla: "INMAG",
          nombre: "Índice Novillo Mercado Agroganadero",
          valor: inmagVal,
          unidad: "$/kg",
          variacion: variacion(inmagVal, prev?.indice?.valor),
        };
        console.log(`  ✓ INMAG (haciinfo000013): ${inmagVal}`);
      }
    }
    if (indice === (prev?.indice ?? undefined) || indice === undefined) {
      // Fallback: intenta proxy con promedio de novillos
      const novilloLiv = categorias.find((c) => c.nombre === "Novillo liviano");
      const novelloPes = categorias.find((c) => c.nombre === "Novillo pesado");
      if (novilloLiv?.prom && novelloPes?.prom && indice === undefined) {
        const proxyVal = Math.round(((novilloLiv.prom + novelloPes.prom) / 2) * 100) / 100;
        indice = {
          sigla: "INMAG",
          nombre: "Proxy INMAG (promedio novillos MAG)",
          valor: proxyVal,
          unidad: "$/kg",
          variacion: variacion(proxyVal, prev?.indice?.valor),
        };
        console.log(`  ~ INMAG proxy (promedio novillos): ${proxyVal}`);
      }
    }
  } catch (e) {
    console.warn(`  ! INMAG scraping falló (${e.message}). Se conserva el valor anterior.`);
    indice = prev?.indice ?? undefined;
  }

  console.log(`  ✓ Gordo (MAG): ${categorias.length} categorías · fecha ${fecha}`);
  return {
    id: "gordo",
    titulo: "Gordo",
    subtitulo: "Hacienda con destino a faena",
    unidad: "$/kg vivo",
    indice,
    categorias,
    fuente: "Mercado Agroganadero de Cañuelas (MAG)",
    fuenteUrl: "https://www.mercadoagroganadero.com.ar",
    actualizado: fecha,
  };
}

// ---------------------------------------------------------------------------
//  Fuente: Invernada (ROSGAN via api.rosgannet.com.ar)
// ---------------------------------------------------------------------------

// SOURCE: https://api.rosgannet.com.ar/api/db/rosgan/app/public/precios_fede | returns: JSON array con PIRI, PIRC y categorías detalladas por tipo (Invernada / Cría)
const ROSGAN_PRECIOS_FEDE_URL = "https://api.rosgannet.com.ar/api/db/rosgan/app/public/precios_fede";

// SOURCE: https://api.rosgannet.com.ar/api/db/rosgan/app/public/precios.xml?_limit=1 | returns: JSON {data:[{piri, pirc, fecha_remate, ...}]} — scalar indices solo, sin categorías
const ROSGAN_PRECIOS_XML_URL = "https://api.rosgannet.com.ar/api/db/rosgan/app/public/precios.xml?_limit=1";

/** Fetch y parsea el registro más reciente de precios_fede (contiene PIRI, PIRC y categorías). */
async function fetchRosganLatest() {
  const text = await fetchText(ROSGAN_PRECIOS_FEDE_URL);
  const json = JSON.parse(text);
  if (!json?.data?.length) throw new Error("ROSGAN precios_fede: respuesta vacía");
  // Ordena por anio_remate DESC, mes_remate DESC para obtener el más reciente
  const sorted = [...json.data].sort((a, b) => {
    if (b.anio_remate !== a.anio_remate) return b.anio_remate - a.anio_remate;
    return b.mes_remate - a.mes_remate;
  });
  return sorted[0];
}

async function scrapeInvernada(prev) {
  let record;
  try {
    record = await fetchRosganLatest();
  } catch (e) {
    throw new Error(`ROSGAN precios_fede inaccesible: ${e.message}`);
  }

  const piriVal = record.piri != null ? parseFloat(record.piri) : null;
  const fecha = record.fecha_remate || todayAR();

  const indice = piriVal != null
    ? {
        sigla: "PIRI",
        nombre: "Precio Índice ROSGAN Invernada",
        valor: piriVal,
        unidad: "$/kg",
        variacion: variacion(piriVal, prev?.indice?.valor),
      }
    : (prev?.indice ?? undefined);

  // Categorías de invernada desde tipos[0].categorias (primer tipo = Invernada)
  // Mapa de títulos en la API -> nombre a mostrar
  const INV_MAP = {
    "Terneros":                       "Ternero",
    "Terneras":                       "Ternera",
    "Terneros/as":                    "Terneros/as (mixto)",
    "Novillos 1 a 2 años":            "Novillito",
    "Novillos 2 a 3 años":            "Novillo",
    "Vaquillonas de invernada":       "Vaquillona",
    "Vacas de invernada":             "Vaca de invernada",
  };

  let categorias = prev?.categorias ?? [];
  try {
    const tipos = record.tipos ?? [];
    // Busca el tipo cuyo título incluya "Invernada" (case-insensitive)
    const tipoInv = tipos.find((t) => /invernada/i.test(t.titulo ?? "")) ?? tipos[0];
    if (tipoInv?.categorias?.length) {
      const parsed = [];
      for (const cat of tipoInv.categorias) {
        const precio = cat.precio != null ? parseFloat(cat.precio) : null;
        if (precio == null || precio === 0) continue;
        const titulo = (cat.titulo ?? "").trim();
        const nombre = INV_MAP[titulo] ?? titulo;
        parsed.push({ nombre, min: null, max: null, prom: precio, variacion: null });
      }
      if (parsed.length) categorias = parsed;
    }
  } catch (e) {
    console.warn(`  ! Invernada categorías: ${e.message}. Se conservan las anteriores.`);
  }

  console.log(`  ✓ Invernada (ROSGAN): PIRI=${piriVal} · ${categorias.length} categorías · fecha ${fecha}`);
  return {
    id: "invernada",
    titulo: "Invernada",
    subtitulo: "Categorías de recría",
    unidad: "$/kg vivo",
    indice,
    categorias,
    fuente: "ROSGAN — Mercado Ganadero (último remate)",
    fuenteUrl: "https://www.rosgan.com.ar/indices",
    actualizado: fecha,
  };
}

// ---------------------------------------------------------------------------
//  Fuente: Cría (ROSGAN via api.rosgannet.com.ar)
// ---------------------------------------------------------------------------

async function scrapeCria(prev) {
  let record;
  try {
    record = await fetchRosganLatest();
  } catch (e) {
    throw new Error(`ROSGAN precios_fede inaccesible: ${e.message}`);
  }

  const pircVal = record.pirc != null ? parseFloat(record.pirc) : null;
  // pirc puede ser 0 cuando no hubo remate de cría ese mes; en ese caso preservar
  const pircEfectivo = pircVal != null && pircVal > 0 ? pircVal : null;
  const fecha = record.fecha_remate || todayAR();

  const indice = pircEfectivo != null
    ? {
        sigla: "PIRC",
        nombre: "Precio Índice ROSGAN Cría",
        valor: pircEfectivo,
        unidad: "$/unidad",
        variacion: variacion(pircEfectivo, prev?.indice?.valor),
      }
    : (prev?.indice ?? undefined);

  // Categorías de cría desde tipos[1].categorias (segundo tipo = Cría/Vientres)
  // Mapa de títulos API -> nombre a mostrar
  const CRIA_MAP = {
    "Vacas con cría al pie":             "Vaca con cría al pie",
    "Vientres con garantía de preñez":   "Vaca/vaquillona preñada",
    "Vientres entorados":                "Vientre entorado",
    "Vaquillonas para cria":             "Vaquillona para cría",
  };

  let categorias = prev?.categorias ?? [];
  let tieneCategorias = false;
  try {
    const tipos = record.tipos ?? [];
    // Busca el tipo cuyo título incluya "Cría" o "Vientre" (case-insensitive)
    const tipoCria = tipos.find((t) => /cr[ií]a|vientre/i.test(t.titulo ?? "")) ?? tipos[1];
    if (tipoCria?.categorias?.length) {
      const parsed = [];
      for (const cat of tipoCria.categorias) {
        const precio = cat.precio != null ? parseFloat(cat.precio) : null;
        if (precio == null || precio === 0) continue;
        const titulo = (cat.titulo ?? "").trim();
        const nombre = CRIA_MAP[titulo] ?? titulo;
        parsed.push({ nombre, min: null, max: null, prom: precio, variacion: null });
      }
      if (parsed.length) {
        categorias = parsed;
        tieneCategorias = true;
      }
    }
  } catch (e) {
    console.warn(`  ! Cría categorías: ${e.message}. Se conservan las anteriores.`);
  }

  console.log(`  ✓ Cría (ROSGAN): PIRC=${pircEfectivo} · ${categorias.length} categorías · fecha ${fecha}`);

  const bloque = {
    id: "cria",
    titulo: "Cría",
    subtitulo: "Vientres y vacas con cría",
    unidad: "$/unidad",
    indice,
    categorias,
    fuente: "ROSGAN — Mercado Ganadero (último remate)",
    fuenteUrl: "https://www.rosgan.com.ar/indices",
    actualizado: fecha,
  };

  // Si NO se obtuvieron categorías reales, marcar como provisorio (mantiene CTA en UI).
  // Si SÍ hay categorías, no incluir el campo (lo elimina de la UI).
  if (!tieneCategorias) {
    bloque.provisorio = true;
  }

  return bloque;
}

// ---------------------------------------------------------------------------
//  Fuente: Granos (Cámara Arbitral de Cereales - BCR Rosario)
// ---------------------------------------------------------------------------

const CAC_URL = "https://www.cac.bcr.com.ar/es/precios-de-pizarra";
const GRANOS = ["Soja", "Maíz", "Trigo", "Girasol", "Sorgo"];

async function scrapeGranos() {
  const html = await fetchText(CAC_URL);
  const texto = stripHtml(html);
  const categorias = [];
  for (const g of GRANOS) {
    // Etiqueta seguida (en ~30 chars) por el primer "$valor".
    const re = new RegExp(`${g}\\b[^$]{0,30}\\$\\s*([\\d.]{4,9})`, "i");
    const m = texto.match(re);
    const prom = m ? num(m[1]) : null;
    if (prom != null) categorias.push({ nombre: g, min: null, max: null, prom, variacion: null });
  }
  if (!categorias.length) throw new Error("CAC: no se parseó ningún grano");

  // Fecha de la pizarra (dd/mm/aaaa) o hoy.
  const fm = texto.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const fecha = fm ? `${fm[3]}-${fm[2].padStart(2, "0")}-${fm[1].padStart(2, "0")}` : todayAR();

  console.log(`  ✓ Granos (CAC): ${categorias.map((c) => c.nombre).join(", ")} · fecha ${fecha}`);
  return {
    id: "granos",
    titulo: "Granos",
    subtitulo: "Pizarra Rosario — referencia de costos",
    unidad: "$/tonelada",
    categorias,
    fuente: "Cámara Arbitral de Cereales — BCR (Rosario)",
    fuenteUrl: "https://www.cac.bcr.com.ar/es/precios-de-pizarra",
    actualizado: fecha,
  };
}

// ---------------------------------------------------------------------------
//  Fuente: Monedas (dolarito.ar — compra y venta)
// ---------------------------------------------------------------------------

const DOLARITO_BASE = "https://www.dolarito.ar";

/** Extrae el __NEXT_DATA__ de una página Next.js de dolarito.ar */
async function fetchDolaritoPage(path) {
  const html = await fetchText(`${DOLARITO_BASE}${path}`);
  const m = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  return {
    json: m ? (() => { try { return JSON.parse(m[1]); } catch { return null; } })() : null,
    html,
  };
}

/**
 * Busca recursivamente en el JSON objetos que tengan campos compra y/o venta
 * con valores numéricos positivos. Retorna un array de {tipo, compra, venta}.
 */
function deepFindCotizaciones(obj, acc = []) {
  if (typeof obj !== "object" || obj === null) return acc;
  if (Array.isArray(obj)) { obj.forEach((v) => deepFindCotizaciones(v, acc)); return acc; }

  const lc = {};
  for (const [k, v] of Object.entries(obj)) lc[k.toLowerCase()] = { k, v };

  const compraEntry = lc["compra"];
  const ventaEntry = lc["venta"];

  if (compraEntry || ventaEntry) {
    const compra = compraEntry ? parseFloat(compraEntry.v) : null;
    const venta = ventaEntry ? parseFloat(ventaEntry.v) : null;
    if (Number.isFinite(compra) || Number.isFinite(ventaEntry?.v)) {
      const nameEntry =
        lc["nombre"] ?? lc["tipo"] ?? lc["name"] ?? lc["casa"] ?? lc["moneda"] ?? lc["currency"];
      acc.push({
        tipo: nameEntry ? String(nameEntry.v).toUpperCase().trim() : null,
        compra: Number.isFinite(compra) && compra > 0 ? compra : null,
        venta: venta != null && Number.isFinite(venta) && venta > 0 ? venta : null,
      });
    }
  }

  for (const val of Object.values(obj)) deepFindCotizaciones(val, acc);
  return acc;
}

/**
 * Extrae compra y venta del texto plano de la página usando regex como fallback.
 * cardTitle: "EURO OFICIAL", "DÓLAR BLUE", etc.
 */
function htmlFallbackCotizacion(html, cardTitle) {
  const text = stripHtml(html).replace(/\s+/g, " ").toUpperCase();
  const titleEsc = cardTitle.toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Patrón: TITULO …(hasta 400 chars)… COMPRA … número … VENTA … número
  let m = text.match(
    new RegExp(`${titleEsc}[\\s\\S]{0,400}?COMPRA[\\D]{0,40}([\\d.,]+)[\\s\\S]{0,200}?VENTA[\\D]{0,40}([\\d.,]+)`)
  );
  if (m) return { compra: num(m[1]), venta: num(m[2]) };

  // También intenta sin el orden específico (extrae los dos primeros números >= 100 tras el título)
  m = text.match(new RegExp(`${titleEsc}[\\s\\S]{0,600}?([\\d]{2,}[\\d.,]*)[\\s\\S]{0,200}?([\\d]{2,}[\\d.,]*)`));
  if (m) {
    const a = num(m[1]);
    const b = num(m[2]);
    if (a != null && b != null && a < b) return { compra: a, venta: b };
    if (a != null && b != null) return { compra: b, venta: a };
  }

  return null;
}

/** Obtiene compra+venta de una página con una sola moneda (dolar/oficial, dolar/blue). */
async function getDolaritoSingle(path, logName) {
  const { json, html } = await fetchDolaritoPage(path);

  if (json) {
    const found = deepFindCotizaciones(json).filter(
      (r) => (r.compra != null && r.compra > 50) || (r.venta != null && r.venta > 50)
    );
    if (found.length > 0) {
      console.log(`  ✓ ${logName}: compra=${found[0].compra} venta=${found[0].venta} (via __NEXT_DATA__)`);
      return found[0];
    }
  }

  // Fallback HTML
  const result = htmlFallbackCotizacion(html, logName);
  if (result) {
    console.log(`  ✓ ${logName}: compra=${result.compra} venta=${result.venta} (via HTML fallback)`);
    return result;
  }

  console.warn(`  ! ${logName}: no se encontraron datos en ${path}`);
  return null;
}

/**
 * Obtiene compra+venta de múltiples monedas en una misma página (euro-hoy, real-hoy).
 * targets: [{key, title}] — title es el nombre de la card ("EURO OFICIAL", etc.)
 */
async function getDolaritoMulti(path, targets) {
  const { json, html } = await fetchDolaritoPage(path);
  const result = {};

  if (json) {
    const found = deepFindCotizaciones(json).filter(
      (r) => (r.compra != null && r.compra > 5) || (r.venta != null && r.venta > 5)
    );

    for (const target of targets) {
      // Intenta match por tipo (nombre del objeto en el JSON)
      const tUpper = target.title.toUpperCase();
      const match = found.find((r) => {
        if (!r.tipo) return false;
        // "EURO OFICIAL" está en r.tipo O r.tipo está en "EURO OFICIAL"
        return r.tipo.includes(tUpper) || tUpper.includes(r.tipo);
      });
      if (match) {
        result[target.key] = match;
        console.log(`  ✓ ${target.title}: compra=${match.compra} venta=${match.venta} (via __NEXT_DATA__)`);
      }
    }
  }

  // Fallback HTML para los no encontrados
  for (const target of targets) {
    if (result[target.key]) continue;
    const fallback = htmlFallbackCotizacion(html, target.title);
    if (fallback) {
      result[target.key] = fallback;
      console.log(`  ✓ ${target.title}: compra=${fallback.compra} venta=${fallback.venta} (via HTML fallback)`);
    } else {
      console.warn(`  ! ${target.title}: no se encontraron datos en ${path}`);
    }
  }

  return result;
}

async function scrapeMonedas(prev) {
  const [dolarOf, dolarBl, euroData, realData] = await Promise.all([
    getDolaritoSingle("/cotizacion/dolar/oficial", "Dólar oficial"),
    getDolaritoSingle("/cotizacion/dolar/blue", "Dólar blue"),
    getDolaritoMulti("/cotizacion/euro-hoy", [
      { key: "euroOf", title: "EURO OFICIAL" },
      { key: "euroBl", title: "EURO BLUE" },
    ]),
    getDolaritoMulti("/cotizacion/real-hoy", [
      { key: "realOf", title: "REAL OFICIAL" },
      { key: "realBl", title: "REAL BLUE" },
    ]),
  ]);

  const cat = (nombre, compra, venta) => ({
    nombre,
    min: null,
    max: null,
    prom: venta ?? null,
    compra: compra ?? null,
    venta: venta ?? null,
    variacion: null,
  });
  const prevCat = (nombre) => prev?.categorias?.find((c) => c.nombre === nombre);

  const hasData = (d) => d?.compra != null || d?.venta != null;

  const categorias = [];
  if (hasData(dolarOf)) categorias.push(cat("Dólar oficial", dolarOf.compra, dolarOf.venta));
  else if (prevCat("Dólar oficial")) categorias.push(prevCat("Dólar oficial"));

  if (hasData(dolarBl)) categorias.push(cat("Dólar blue", dolarBl.compra, dolarBl.venta));
  else if (prevCat("Dólar blue")) categorias.push(prevCat("Dólar blue"));

  if (hasData(euroData?.euroOf)) categorias.push(cat("Euro oficial", euroData.euroOf.compra, euroData.euroOf.venta));
  else if (prevCat("Euro oficial")) categorias.push(prevCat("Euro oficial"));

  if (hasData(euroData?.euroBl)) categorias.push(cat("Euro blue", euroData.euroBl.compra, euroData.euroBl.venta));
  else if (prevCat("Euro blue")) categorias.push(prevCat("Euro blue"));

  if (hasData(realData?.realOf)) categorias.push(cat("Real oficial", realData.realOf.compra, realData.realOf.venta));
  else if (prevCat("Real oficial")) categorias.push(prevCat("Real oficial"));

  if (hasData(realData?.realBl)) categorias.push(cat("Real blue", realData.realBl.compra, realData.realBl.venta));
  else if (prevCat("Real blue")) categorias.push(prevCat("Real blue"));

  if (!categorias.length) throw new Error("Monedas: sin datos de dolarito.ar");

  console.log(`  ✓ Monedas: ${categorias.map((c) => c.nombre).join(", ")}`);
  return {
    id: "monedas",
    titulo: "Monedas",
    subtitulo: "Cotizaciones de referencia",
    unidad: "en pesos (ARS)",
    categorias,
    fuente: "dolarito.ar",
    fuenteUrl: "https://www.dolarito.ar",
    actualizado: todayAR(),
  };
}

// ---------------------------------------------------------------------------
//  Cálculo de variación contra el snapshot anterior
// ---------------------------------------------------------------------------

function aplicarVariacion(bloque, prevBloque) {
  if (!prevBloque) return bloque;
  const prevByName = new Map(prevBloque.categorias.map((c) => [c.nombre, c]));
  bloque.categorias = bloque.categorias.map((c) => {
    const p = prevByName.get(c.nombre);
    return { ...c, variacion: variacion(c.prom, p?.prom) };
  });
  return bloque;
}

// ---------------------------------------------------------------------------
//  Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("→ Actualizando precios de referencia…");

  // Snapshot anterior (para fallback + variación). Siempre debería existir.
  let prev = null;
  try {
    prev = JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    console.warn("  ! No se pudo leer el precios.json anterior (primera corrida?).");
  }
  const prevBloque = (id) => prev?.bloques?.find((b) => b.id === id);

  // Arranca de una copia del anterior y va reemplazando lo que se logra scrapear.
  const bloques = prev?.bloques ? structuredClone(prev.bloques) : [];
  const setBloque = (b) => {
    const i = bloques.findIndex((x) => x.id === b.id);
    if (i >= 0) bloques[i] = b;
    else bloques.push(b);
  };

  // --- Gordo ---
  try {
    const g = await scrapeGordo(prevBloque("gordo"));
    setBloque(aplicarVariacion(g, prevBloque("gordo")));
  } catch (e) {
    console.warn(`  ! Gordo falló (${e.message}). Se conserva el valor anterior.`);
  }

  // --- Granos ---
  try {
    const gr = await scrapeGranos();
    setBloque(aplicarVariacion(gr, prevBloque("granos")));
  } catch (e) {
    console.warn(`  ! Granos falló (${e.message}). Se conserva el valor anterior.`);
  }

  // --- Invernada ---
  try {
    const inv = await scrapeInvernada(prevBloque("invernada"));
    setBloque(aplicarVariacion(inv, prevBloque("invernada")));
  } catch (e) {
    console.warn(`  ! Invernada falló (${e.message}). Se conserva el valor anterior.`);
  }

  // --- Cría ---
  try {
    const cria = await scrapeCria(prevBloque("cria"));
    setBloque(aplicarVariacion(cria, prevBloque("cria")));
  } catch (e) {
    console.warn(`  ! Cría falló (${e.message}). Se conserva el valor anterior.`);
  }

  // --- Monedas ---
  try {
    const m = await scrapeMonedas(prevBloque("monedas"));
    setBloque(aplicarVariacion(m, prevBloque("monedas")));
  } catch (e) {
    console.warn(`  ! Monedas falló (${e.message}). Se conserva el valor anterior.`);
  }


  if (!bloques.length) {
    console.error("✗ No hay datos para escribir (ni scraping ni snapshot previo). Aborto.");
    process.exit(1);
  }

  // Ordena las pestañas de forma estable.
  const orden = ["gordo", "invernada", "cria", "granos", "monedas"];
  bloques.sort((a, b) => orden.indexOf(a.id) - orden.indexOf(b.id));

  const data = { generado: new Date().toISOString(), bloques };
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`✓ Escrito ${OUT}`);
}

main().catch((e) => {
  console.error("✗ Error fatal:", e);
  process.exit(1);
});
