"use client";

import { useEffect, useRef, useState } from "react";
import {
  preciosSeed,
  type PreciosData,
  type BloquePrecios,
  type Indice,
} from "@/data/precios";
import { useFadeInUp } from "@/hooks/useFadeInUp";

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

function money(n: number | null | undefined): string {
  if (n == null) return "—";
  return "$" + nf.format(Math.round(n));
}

function fmtFecha(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function bloqueTieneRango(b: BloquePrecios): boolean {
  return b.categorias.some((c) => c.min != null && c.max != null);
}

/** Chip de variación con flecha y color (suba verde / baja roja). */
function Variacion({ v }: { v?: number | null }) {
  if (v == null) return <span className="text-on-surface-variant/50">—</span>;
  const flat = v === 0;
  const up = v > 0;
  const color = flat ? "text-on-surface-variant" : up ? "text-up" : "text-error";
  const icon = flat ? "trending_flat" : up ? "trending_up" : "trending_down";
  const val = `${up ? "+" : ""}${v.toFixed(1).replace(".", ",")}%`;
  return (
    <span className={`inline-flex items-center gap-0.5 font-inter text-sm font-semibold ${color}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
        {icon}
      </span>
      {val}
    </span>
  );
}

/** Estado para bloques sin datos precisos (ej. Cría): aviso + CTA a WhatsApp. */
function SinInfo({ fuente, fuenteUrl }: { fuente: string; fuenteUrl: string }) {
  return (
    <div className="px-5 md:px-7 py-12 md:py-16 flex flex-col items-center text-center">
      <span
        className="material-symbols-outlined text-on-surface-variant/40"
        style={{ fontSize: 44 }}
        aria-hidden
      >
        info
      </span>
      <h3 className="font-garamond text-[22px] font-medium text-on-background mt-3">
        Sin información precisa
      </h3>
      <p className="font-merriweather text-sm leading-[22px] text-on-surface-variant max-w-md mt-2">
        Los valores de cría se definen por remate y zona, y varían según el lote. Escribinos y te
        pasamos una referencia actualizada para tu rodeo.
      </p>
      <a
        href="https://wa.me/5491162045433"
        className="mt-6 inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded font-inter text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
          chat
        </span>
        Consultar precios de cría
      </a>
      <p className="font-inter text-xs text-on-surface-variant/70 mt-5">
        Referencia:{" "}
        <a
          href={fuenteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-primary"
        >
          {fuente}
        </a>
      </p>
    </div>
  );
}

export default function PreciosReferencia() {
  const [data, setData] = useState<PreciosData>(preciosSeed);
  const [activeId, setActiveId] = useState<string>(preciosSeed.bloques[0].id);

  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useFadeInUp(headRef, 0);
  useFadeInUp(bodyRef, 100);

  // En runtime intenta traer el archivo "vivo" que sobrescribe el scraper.
  // Si falla o es inválido, se queda con el seed compilado (nunca rompe).
  useEffect(() => {
    let cancelled = false;
    fetch("/precios.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("not ok"))))
      .then((json: PreciosData) => {
        if (!cancelled && json && Array.isArray(json.bloques) && json.bloques.length) {
          setData(json);
        }
      })
      .catch(() => {
        /* mantiene el seed */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const bloque = data.bloques.find((b) => b.id === activeId) ?? data.bloques[0];
  const rango = bloqueTieneRango(bloque);
  const indices = data.bloques
    .map((b) => b.indice)
    .filter((i): i is Indice => Boolean(i));

  return (
    <section
      id="precios"
      className="py-16 md:py-[120px] bg-surface-container-highest scroll-mt-20"
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        {/* Encabezado */}
        <div ref={headRef} className="fade-in-up max-w-2xl mb-10">
          <p className="font-inter text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Mercado
          </p>
          <h2 className="font-garamond text-[32px] font-medium leading-[40px] text-on-background mb-4">
            Precios de referencia
          </h2>
          <p className="font-merriweather text-base leading-[26px] text-on-surface-variant">
            Cotizaciones orientativas de las principales categorías de hacienda y granos, con su
            variación. Para operar, consultanos por la categoría que te interesa.
          </p>
        </div>

        <div ref={bodyRef} className="fade-in-up">
          {/* Índices destacados */}
          {indices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {indices.map((idx) => (
                <div
                  key={idx.sigla}
                  className="border border-outline bg-surface-container-lowest p-5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-inter text-sm font-bold tracking-wide text-primary">
                      {idx.sigla}
                    </p>
                    <Variacion v={idx.variacion} />
                  </div>
                  <p className="font-inter text-[11px] leading-tight text-on-surface-variant/80 mb-3 min-h-[28px]">
                    {idx.nombre}
                  </p>
                  <p className="font-garamond text-[28px] leading-none font-medium text-on-background tabular-nums">
                    {money(idx.valor)}
                  </p>
                  <p className="font-inter text-xs text-on-surface-variant mt-1">{idx.unidad}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pestañas */}
          <div className="flex flex-wrap gap-1 border-b border-outline-variant" role="tablist">
            {data.bloques.map((b) => {
              const active = b.id === activeId;
              return (
                <button
                  key={b.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveId(b.id)}
                  className={`-mb-px px-4 md:px-6 py-3 font-inter text-sm font-semibold border-b-2 transition-colors ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {b.titulo}
                </button>
              );
            })}
          </div>

          {/* Tabla / tarjetas */}
          <div className="border border-outline border-t-0 bg-surface-container-lowest">
            <div className="px-5 md:px-7 pt-6 pb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-garamond text-[22px] font-medium leading-tight text-on-background">
                {bloque.subtitulo}
              </h3>
              <span className="font-inter text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                {bloque.unidad}
              </span>
            </div>

            {bloque.provisorio ? (
              <SinInfo fuente={bloque.fuente} fuenteUrl={bloque.fuenteUrl} />
            ) : (
              <>
            {/* Desktop: tabla */}
            <table className="hidden md:table w-full border-collapse">
              <thead>
                <tr className="border-y border-outline-variant text-on-surface-variant">
                  <th className="text-left font-inter text-xs font-semibold uppercase tracking-wide px-7 py-3">
                    {bloque.id === "granos" ? "Producto" : "Categoría"}
                  </th>
                  {rango && (
                    <th className="text-right font-inter text-xs font-semibold uppercase tracking-wide px-3 py-3">
                      Mín
                    </th>
                  )}
                  {rango && (
                    <th className="text-right font-inter text-xs font-semibold uppercase tracking-wide px-3 py-3">
                      Máx
                    </th>
                  )}
                  <th className="text-right font-inter text-xs font-semibold uppercase tracking-wide px-3 py-3">
                    {rango ? "Promedio" : "Precio"}
                  </th>
                  <th className="text-right font-inter text-xs font-semibold uppercase tracking-wide pr-7 pl-3 py-3">
                    Var.
                  </th>
                </tr>
              </thead>
              <tbody>
                {bloque.categorias.map((c) => (
                  <tr
                    key={c.nombre}
                    className="border-b border-outline-variant/60 last:border-0 hover:bg-surface-container/40 transition-colors"
                  >
                    <td className="px-7 py-3.5 font-merriweather text-[15px] text-on-background">
                      {c.nombre}
                    </td>
                    {rango && (
                      <td className="text-right px-3 py-3.5 font-inter tabular-nums text-on-surface-variant">
                        {money(c.min)}
                      </td>
                    )}
                    {rango && (
                      <td className="text-right px-3 py-3.5 font-inter tabular-nums text-on-surface-variant">
                        {money(c.max)}
                      </td>
                    )}
                    <td className="text-right px-3 py-3.5 font-inter tabular-nums font-semibold text-on-background">
                      {money(c.prom)}
                    </td>
                    <td className="text-right pr-7 pl-3 py-3.5">
                      <Variacion v={c.variacion} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile: tarjetas */}
            <div className="md:hidden border-t border-outline-variant divide-y divide-outline-variant/60">
              {bloque.categorias.map((c) => (
                <div key={c.nombre} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-merriweather text-[15px] text-on-background">{c.nombre}</p>
                    {rango && (
                      <p className="font-inter text-xs text-on-surface-variant mt-0.5 tabular-nums">
                        Mín {money(c.min)} · Máx {money(c.max)}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-inter text-base font-semibold tabular-nums text-on-background">
                      {money(c.prom)}
                    </p>
                    <Variacion v={c.variacion} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pie: fuente, fecha, aviso + CTA */}
            <div className="px-5 md:px-7 py-5 border-t border-outline-variant bg-surface-container-low/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="font-inter text-xs text-on-surface-variant leading-relaxed">
                <p>
                  Fuente:{" "}
                  <a
                    href={bloque.fuenteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline decoration-dotted underline-offset-2 hover:text-primary"
                  >
                    {bloque.fuente}
                  </a>{" "}
                  · Actualizado: {fmtFecha(bloque.actualizado)}
                  {bloque.provisorio && (
                    <span className="ml-1 text-secondary">(referencia provisoria)</span>
                  )}
                </p>
                <p className="mt-1 text-on-surface-variant/70">
                  Valores orientativos de referencia, no vinculantes.
                </p>
              </div>
              <a
                href="https://wa.me/5491162045433"
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded font-inter text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
                  chat
                </span>
                Consultá el precio de tu categoría
              </a>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
