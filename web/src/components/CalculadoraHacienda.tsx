"use client";

import { useMemo, useRef, useState } from "react";
import { usePrecios, dolarVenta } from "@/hooks/usePrecios";
import { useFadeInUp } from "@/hooks/useFadeInUp";

const WHATSAPP = "https://wa.me/5491162045433";
const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const money = (n: number) => "$" + nf.format(Math.round(n));
const usd = (n: number) => "US$ " + nf.format(Math.round(n));

export default function CalculadoraHacienda() {
  const data = usePrecios();
  const ref = useRef<HTMLDivElement>(null);
  useFadeInUp(ref, 0);

  // Solo categorías con precio por kg (gordo + invernada).
  const grupos = useMemo(
    () =>
      data.bloques
        .filter((b) => b.id === "gordo" || b.id === "invernada")
        .map((b) => ({ titulo: b.titulo, cats: b.categorias.filter((c) => c.prom != null) }))
        .filter((g) => g.cats.length),
    [data]
  );
  const todas = useMemo(() => grupos.flatMap((g) => g.cats), [grupos]);

  const [sel, setSel] = useState("");
  const [kg, setKg] = useState("400");
  const [cabezas, setCabezas] = useState("1");

  const cat = todas.find((c) => c.nombre === sel) ?? todas[0];
  const precio = cat?.prom ?? null;
  const kgN = Math.max(0, parseFloat(kg) || 0);
  const cabN = Math.max(0, parseInt(cabezas, 10) || 0);

  const porCabeza = precio != null ? precio * kgN : 0;
  const total = porCabeza * cabN;
  const tasa = dolarVenta(data, "blue");
  const valido = precio != null && kgN > 0 && cabN > 0;

  const mensaje =
    `Hola GyMG, quería consultar por ${cabN || ""} ${cabN === 1 ? "cabeza" : "cabezas"} de ` +
    `${cat?.nombre ?? ""} de ~${kgN} kg c/u. Según los precios de referencia la estimación ` +
    `sería ${money(total)}. ¿Me asesoran?`;
  const waHref = valido ? `${WHATSAPP}?text=${encodeURIComponent(mensaje)}` : WHATSAPP;

  return (
    <div ref={ref} className="fade-in-up mt-8 border border-outline bg-surface-container-lowest">
      <div className="px-5 md:px-7 py-6 border-b border-outline-variant">
        <h3 className="font-garamond text-[24px] font-medium leading-tight text-on-background">
          ¿Cuánto vale tu hacienda?
        </h3>
        <p className="font-merriweather text-sm leading-[22px] text-on-surface-variant mt-1">
          Estimación rápida con el promedio de referencia del día. Después afinamos el precio real
          de tu operación.
        </p>
      </div>

      <div className="px-5 md:px-7 py-6 grid md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="font-inter text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Categoría
          </span>
          <select
            value={cat?.nombre ?? ""}
            onChange={(e) => setSel(e.target.value)}
            className="h-11 px-3 bg-surface-container-low border border-outline rounded font-inter text-sm text-on-background focus:outline-none focus:border-primary"
          >
            {grupos.map((g) => (
              <optgroup key={g.titulo} label={g.titulo}>
                {g.cats.map((c) => (
                  <option key={c.nombre} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-inter text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Peso promedio (kg)
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="h-11 px-3 bg-surface-container-low border border-outline rounded font-inter text-sm text-on-background tabular-nums focus:outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-inter text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Cabezas
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={cabezas}
            onChange={(e) => setCabezas(e.target.value)}
            className="h-11 px-3 bg-surface-container-low border border-outline rounded font-inter text-sm text-on-background tabular-nums focus:outline-none focus:border-primary"
          />
        </label>
      </div>

      {/* Resultado */}
      <div className="px-5 md:px-7 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1">
            Estimación total
          </p>
          <p className="font-garamond text-[34px] leading-none font-medium text-on-background tabular-nums">
            {valido ? money(total) : "—"}
          </p>
          <p className="font-inter text-xs text-on-surface-variant mt-2 tabular-nums">
            {valido ? (
              <>
                {cabN} {cabN === 1 ? "cabeza" : "cabezas"} · {money(porCabeza)} c/u ·{" "}
                {precio != null ? money(precio) : "—"}/kg
                {tasa != null && <> · ≈ {usd(total / tasa)}</>}
              </>
            ) : (
              "Completá categoría, peso y cabezas."
            )}
          </p>
        </div>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded font-inter text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden>
            chat
          </span>
          Consultar esta operación
        </a>
      </div>

      <div className="px-5 md:px-7 py-3 border-t border-outline-variant bg-surface-container-low/50">
        <p className="font-inter text-xs text-on-surface-variant/70 leading-relaxed">
          Estimación orientativa según el promedio de referencia; el precio final depende de la
          calidad, el volumen y las condiciones de la operación.
        </p>
      </div>
    </div>
  );
}
