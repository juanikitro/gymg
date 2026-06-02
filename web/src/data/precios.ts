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
  /** Compra / venta para el bloque de monedas. En el resto van ausentes. */
  compra?: number | null;
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
        { nombre: "Novillo liviano", min: 3500, max: 4220, prom: 3855.901, variacion: 0 },
        { nombre: "Novillo pesado", min: 2700, max: 4100, prom: 3633.708, variacion: 0 },
        { nombre: "Novillito", min: 1700, max: 5340, prom: 4596.957, variacion: 0 },
        { nombre: "Vaquillona", min: 2500, max: 5400, prom: 4345.666, variacion: 0 },
        { nombre: "Vaca buena", min: 2000, max: 4400, prom: 2914.142, variacion: 0 },
        { nombre: "Vaca regular", min: 1500, max: 3220, prom: 2490.539, variacion: 0 },
        { nombre: "Vaca conserva", min: 1700, max: 2640, prom: 2258.759, variacion: 0 },
        { nombre: "Toro", min: 2500, max: 3350, prom: 2904.079, variacion: 0 },
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
        { nombre: "Dólar oficial", min: null, max: null, prom: 1450, compra: 1400, venta: 1450, variacion: null },
        { nombre: "Dólar blue", min: null, max: null, prom: 1435, compra: 1415, venta: 1435, variacion: null },
        { nombre: "Euro oficial", min: null, max: null, prom: 1660.03, compra: 1646.01, venta: 1660.03, variacion: null },
        { nombre: "Euro blue", min: null, max: null, prom: 1642.86, compra: 1619.96, venta: 1642.86, variacion: null },
        { nombre: "Real", min: null, max: null, prom: 283.94, compra: 283.77, venta: 283.94, variacion: null },
        { nombre: "Yen", min: null, max: null, prom: 9.09, compra: 8.77, venta: 9.09, variacion: null },
      ],
      fuente: "dolarapi.com + open.er-api.com",
      fuenteUrl: "https://dolarapi.com",
      actualizado: "2026-06-02",
    },
  ],
};

export default preciosSeed;
