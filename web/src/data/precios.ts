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

export type BloqueId = "gordo" | "invernada" | "cria" | "granos";

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
  generado: "2026-06-02T12:00:00-03:00",
  bloques: [
    {
      id: "gordo",
      titulo: "Gordo",
      subtitulo: "Hacienda con destino a faena",
      unidad: "$/kg vivo",
      indice: {
        sigla: "INMAG",
        nombre: "Índice Novillo Mercado Agroganadero",
        valor: 4074.65,
        unidad: "$/kg",
        variacion: -3.9,
      },
      categorias: [
        { nombre: "Novillo liviano", min: 3500, max: 4220, prom: 3855.9, variacion: null },
        { nombre: "Novillo pesado", min: 2700, max: 4100, prom: 3532.89, variacion: null },
        { nombre: "Novillito", min: 3000, max: 4200, prom: 3800.31, variacion: null },
        { nombre: "Vaquillona", min: 2500, max: 4800, prom: 3722.14, variacion: null },
        { nombre: "Vaca buena", min: 2000, max: 4400, prom: 2915.69, variacion: null },
        { nombre: "Vaca regular", min: 1500, max: 3220, prom: 2506.24, variacion: null },
        { nombre: "Vaca conserva", min: 1700, max: 2640, prom: 2258.37, variacion: null },
        { nombre: "Toro", min: 2500, max: 3350, prom: 2904.59, variacion: null },
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
        valor: 5522.88,
        unidad: "$/kg",
        variacion: 12.7,
      },
      categorias: [
        { nombre: "Ternero", min: null, max: null, prom: 6269.41, variacion: null },
        { nombre: "Ternera", min: null, max: null, prom: 5440.61, variacion: null },
        { nombre: "Terneros/as (mixto)", min: null, max: null, prom: 5671.04, variacion: null },
      ],
      fuente: "ROSGAN — Mercado Ganadero (último remate)",
      fuenteUrl: "https://www.rosgan.com.ar",
      actualizado: "2026-02-26",
    },
    {
      id: "cria",
      titulo: "Cría",
      subtitulo: "Vientres y vacas con cría",
      unidad: "$/unidad",
      indice: {
        sigla: "PIRC",
        nombre: "Precio Índice ROSGAN Cría",
        valor: 2078292.22,
        unidad: "$/unidad",
        variacion: 17.4,
      },
      // Cría se cotiza por remate; sin dato público preciso → la UI muestra
      // "Sin información precisa" + CTA (ver provisorio).
      categorias: [],
      fuente: "ROSGAN — Mercado Ganadero (último remate)",
      fuenteUrl: "https://www.rosgan.com.ar",
      actualizado: "2026-02-26",
      provisorio: true,
    },
    {
      id: "granos",
      titulo: "Granos",
      subtitulo: "Pizarra Rosario — referencia de costos",
      unidad: "$/tonelada",
      categorias: [
        { nombre: "Soja", min: null, max: null, prom: 465000, variacion: null },
        { nombre: "Maíz", min: null, max: null, prom: 255760, variacion: null },
        { nombre: "Trigo", min: null, max: null, prom: 303240, variacion: null },
        { nombre: "Girasol", min: null, max: null, prom: 595140, variacion: null },
        { nombre: "Sorgo", min: null, max: null, prom: 274900, variacion: null },
      ],
      fuente: "Cámara Arbitral de Cereales — BCR (Rosario)",
      fuenteUrl: "https://www.cac.bcr.com.ar/es/precios-de-pizarra",
      actualizado: "2026-06-01",
    },
  ],
};

export default preciosSeed;
