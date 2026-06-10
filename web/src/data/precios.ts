// ============================================================================
//  Precios de Referencia — modelo de datos + seed
// ----------------------------------------------------------------------------
//  Este archivo define la forma de los datos y un "seed" con valores reales
//  recientes. El seed se compila dentro del HTML (SEO, funciona sin JS y sirve
//  de fallback). En runtime, <PreciosReferencia/> intenta traer /precios.json
//  (que el scraper sobrescribe) y, si es válido, lo usa en lugar del seed.
//
//  IMPORTANTE: la MISMA forma (PreciosData) la produce scripts/scrape-precios.mjs.
//  Si cambiás los tipos, actualizá también el scraper.
// ============================================================================

export type BloqueId = "gordo" | "invernada" | "cria" | "granos" | "monedas";

/** Una fila de la tabla: una categoría de hacienda o un grano. */
export interface CategoriaPrecio {
  nombre: string;
  /** Mínimo. `null` cuando la fuente publica un único valor (invernada/cría/granos). */
  min: number | null;
  /** Máximo. `null` cuando no hay rango. */
  max: number | null;
  /** Promedio o precio único. Es el valor "principal" de la fila. */
  prom: number | null;
  /** Variación % vs período anterior (la calcula el scraper). `null` = sin dato. */
  variacion?: number | null;
  /** Cotización de compra para el bloque de monedas. En el resto va ausente. */
  compra?: number | null;
  /** Cotización de venta para el bloque de monedas. En el resto va ausente. */
  venta?: number | null;
}

/** Índice destacado (titular) de un bloque: INMAG / PIRI / PIRC. */
export interface Indice {
  sigla: string;
  nombre: string;
  valor: number;
  unidad: string;
  variacion: number | null;
}

/** Un bloque = una pestaña del cuadro. */
export interface BloquePrecios {
  id: BloqueId;
  titulo: string;
  subtitulo: string;
  /** Unidad de los valores de las categorías: "$/kg vivo", "$/unidad", "$/tonelada". */
  unidad: string;
  indice?: Indice;
  categorias: CategoriaPrecio[];
  fuente: string;
  fuenteUrl: string;
  /** Fecha del dato (ISO YYYY-MM-DD). */
  actualizado: string;
  /** Marca al bloque como referencia provisoria (ej. cría hasta tener scraping). */
  provisorio?: boolean;
}

export interface PreciosData {
  /** Timestamp ISO de generación de los datos. */
  generado: string;
  bloques: BloquePrecios[];
}

// ----------------------------------------------------------------------------
//  SEED — valores reales recientes (ver fuentes por bloque).
// ----------------------------------------------------------------------------

export const preciosSeed: PreciosData = {
  generado: "2026-06-02T20:59:42.430Z",
  bloques: [
    {
      id: "gordo",
      titulo: "Gordo",
      subtitulo: "Hacienda con destino a faena",
      unidad: "$/kg vivo",
      indice: {
        sigla: "INMAG",
        nombre: "Índice Novillo Mercado Agroganadero",
        valor: 4089.815,
        unidad: "$/kg",
        variacion: 0.4,
      },
      categorias: [
        { nombre: "Novillo EyB 431-460",     min: 3800, max: 4400, prom: 4195.217, variacion: 0 },
        { nombre: "Novillo EyB 461-490",     min: 3600, max: 4400, prom: 4142.215, variacion: 0 },
        { nombre: "Novillo EyB 491-520",     min: 3400, max: 4400, prom: 4044.072, variacion: 0 },
        { nombre: "Novillo EyB +520",        min: 2900, max: 4400, prom: 4018.604, variacion: 0 },
        { nombre: "Novillo liviano",         min: 3800, max: 4300, prom: 3949.630, variacion: 0 },
        { nombre: "Novillo pesado",          min: 3700, max: 4200, prom: 3735.116, variacion: 0 },
        { nombre: "Novillo overo",           min: 3500, max: 3900, prom: 3694.805, variacion: 0 },
        { nombre: "Novillito EyB liviano",   min: 3400, max: 5200, prom: 4749.038, variacion: 0 },
        { nombre: "Novillito EyB pesado",    min: 3200, max: 4600, prom: 4238.708, variacion: 0 },
        { nombre: "Novillito",              min: 2300, max: 4100, prom: 3472.029, variacion: 0 },
        { nombre: "Vaquillona EyB liviana",  min: 2900, max: 5500, prom: 4453.671, variacion: 0 },
        { nombre: "Vaquillona EyB pesada",   min: 3000, max: 4300, prom: 3800.975, variacion: 0 },
        { nombre: "Vaquillona",             min: 2600, max: 4000, prom: 3496.140, variacion: 0 },
        { nombre: "Vaca buena",             min: 1600, max: 3600, prom: 2843.273, variacion: 0 },
        { nombre: "Vaca regular",           min: 1500, max: 3000, prom: 2337.000, variacion: 0 },
        { nombre: "Vaca conserva",          min: 1600, max: 2900, prom: 2156.000, variacion: 0 },
        { nombre: "Vaca conserva inferior", min: 1500, max: 2500, prom: 1884.000, variacion: 0 },
        { nombre: "Toro",                   min: 2500, max: 3700, prom: 3106.000, variacion: 0 },
        { nombre: "Toro regular",           min: 2400, max: 3300, prom: 2797.000, variacion: 0 },
        { nombre: "MEJ EyB",                min: 3200, max: 5000, prom: 4176.000, variacion: 0 },
        { nombre: "MEJ regular",            min: 2800, max: 4200, prom: 3499.000, variacion: 0 },
      ],
      fuente: "Mercado Agroganadero de Cañuelas (MAG)",
      fuenteUrl: "https://www.mercadoagroganadero.com.ar",
      actualizado: "2026-06-02",
    },
    {
      id: "invernada",
      titulo: "Invernada",
      subtitulo: "Categorías de recría",
      unidad: "$/kg vivo",
      indice: {
        sigla: "PIRI",
        nombre: "Precio Índice ROSGAN Invernada",
        valor: 5581,
        unidad: "$/kg",
        variacion: 1.1,
      },
      categorias: [
        { nombre: "Ternero", min: null, max: null, prom: 6284.77, variacion: 0.2 },
        { nombre: "Ternera", min: null, max: null, prom: 5856.76, variacion: 7.6 },
        { nombre: "Terneros/as (mixto)", min: null, max: null, prom: 6055.95, variacion: 6.8 },
        { nombre: "Novillito", min: null, max: null, prom: 4842.71, variacion: null },
        { nombre: "Novillo", min: null, max: null, prom: 4380.29, variacion: null },
        { nombre: "Vaquillona", min: null, max: null, prom: 4349.72, variacion: null },
        { nombre: "Vaca de invernada", min: null, max: null, prom: 2817.02, variacion: null },
      ],
      fuente: "ROSGAN — Mercado Ganadero (último remate)",
      fuenteUrl: "https://www.rosgan.com.ar/indices",
      actualizado: "2026-05-27",
    },
    {
      id: "cria",
      titulo: "Cría",
      subtitulo: "Vientres y vacas con cría",
      unidad: "$/unidad",
      indice: {
        sigla: "PIRC",
        nombre: "Precio Índice ROSGAN Cría",
        valor: 2125772.95,
        unidad: "$/unidad",
        variacion: 2.3,
      },
      categorias: [
        { nombre: "Vaca/vaquillona preñada", min: null, max: null, prom: 2111417.53, variacion: null },
      ],
      fuente: "ROSGAN — Mercado Ganadero (último remate)",
      fuenteUrl: "https://www.rosgan.com.ar/indices",
      actualizado: "2026-05-27",
    },
    {
      id: "granos",
      titulo: "Granos",
      subtitulo: "Pizarra Rosario — referencia de costos",
      unidad: "$/tonelada",
      categorias: [
        { nombre: "Soja", min: null, max: null, prom: 465000, variacion: 0 },
        { nombre: "Maíz", min: null, max: null, prom: 255760, variacion: 0 },
        { nombre: "Trigo", min: null, max: null, prom: 303240, variacion: 0 },
        { nombre: "Girasol", min: null, max: null, prom: 595140, variacion: 0 },
        { nombre: "Sorgo", min: null, max: null, prom: 274900, variacion: 0 },
      ],
      fuente: "Cámara Arbitral de Cereales — BCR (Rosario)",
      fuenteUrl: "https://www.cac.bcr.com.ar/es/precios-de-pizarra",
      actualizado: "2026-06-01",
    },
    {
      id: "monedas",
      titulo: "Monedas",
      subtitulo: "Cotizaciones de referencia",
      unidad: "en pesos (ARS)",
      categorias: [
        { nombre: "Dólar oficial", min: null, max: null, prom: 1450, compra: 1440, venta: 1450, variacion: null },
        { nombre: "Dólar blue", min: null, max: null, prom: 1435, compra: 1425, venta: 1435, variacion: null },
        { nombre: "Euro oficial", min: null, max: null, prom: 1660.03, compra: 1621, venta: 1660.03, variacion: null },
        { nombre: "Euro blue", min: null, max: null, prom: 1642.86, compra: 1604, venta: 1642.86, variacion: null },
        { nombre: "Real oficial", min: null, max: null, prom: 283.94, compra: 270, venta: 283.94, variacion: null },
        { nombre: "Real blue", min: null, max: null, prom: 277, compra: 264, venta: 277, variacion: null },
      ],
      fuente: "dolarapi.com · bluelytics.com.ar",
      fuenteUrl: "https://dolarapi.com",
      actualizado: "2026-06-10",
    },
  ],
};

export default preciosSeed;
