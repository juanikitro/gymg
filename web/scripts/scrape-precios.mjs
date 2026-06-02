#!/usr/bin/env node
// ============================================================================
//  scrape-precios.mjs — actualiza web/public/precios.json
// ----------------------------------------------------------------------------
//  Sin dependencias (Node 18+: fetch nativo + regex). Pensado para correr en
//  CI (GitHub Actions) o a mano con `npm run scrape`.
//
//  Qué actualiza de forma AUTOMÁTICA y confiable:
//    • Gordo   → tabla HTML del Mercado Agroganadero de Cañuelas (MAG)
//    • Granos  → pizarra de la Cámara Arbitral de Cereales (BCR Rosario)
//
//  Qué PRESERVA del archivo anterior (no salen del HTML estático):
//    • Índices INMAG / PIRI / PIRC (se renderizan por JS en sus sitios)
//    • Invernada y Cría (ROSGAN es una SPA; su API no está expuesta)
//  → Esos bloques se mantienen con su último valor y su fecha, hasta que se
//    actualicen a mano o se resuelva una fuente. Nunca quedan vacíos.
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
  { nombre: "Novillo liviano", match: "NOVILLOS Regulares Liv" },
  { nombre: "Novillo pesado", match: "NOVILLOS Regulares Pes" },
  { nombre: "Novillito", match: "NOVILLITOS Regulares" },
  { nombre: "Vaquillona", match: "VAQUILLONAS Regulares" },
  { nombre: "Vaca buena", match: "VACAS Buenas" },
  { nombre: "Vaca regular", match: "VACAS Regulares" },
  { nombre: "Vaca conserva", match: "VACAS Conserva Buena" },
  { nombre: "Toro", match: "TOROS Buenos" },
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

  const fecha = fechaTextoAIso(stripHtml(html)) || todayAR();

  // Mantiene el índice del bloque anterior (INMAG no sale del HTML).
  const indice = prev?.indice ?? undefined;

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

  // Invernada / Cría: se preservan tal cual venían en `prev` (no se scrapean aún).

  if (!bloques.length) {
    console.error("✗ No hay datos para escribir (ni scraping ni snapshot previo). Aborto.");
    process.exit(1);
  }

  // Ordena las pestañas de forma estable.
  const orden = ["gordo", "invernada", "cria", "granos"];
  bloques.sort((a, b) => orden.indexOf(a.id) - orden.indexOf(b.id));

  const data = { generado: new Date().toISOString(), bloques };
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`✓ Escrito ${OUT}`);
}

main().catch((e) => {
  console.error("✗ Error fatal:", e);
  process.exit(1);
});
