"use client";

import { useEffect, useState } from "react";
import { preciosSeed, type PreciosData } from "@/data/precios";

/**
 * Datos de precios para el cuadro y la calculadora.
 * Arranca con el seed compilado (SEO / sin-JS / fallback) e intenta traer
 * /precios.json (que el scraper sobrescribe). Si falla, se queda con el seed.
 */
export function usePrecios(): PreciosData {
  const [data, setData] = useState<PreciosData>(preciosSeed);

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

  return data;
}

/** Venta del dólar (blue por defecto) desde el bloque de monedas, para convertir a USD. */
export function dolarVenta(data: PreciosData, casa: "blue" | "oficial" = "blue"): number | null {
  const nombre = casa === "blue" ? "Dólar blue" : "Dólar oficial";
  const monedas = data.bloques.find((b) => b.id === "monedas");
  return monedas?.categorias.find((c) => c.nombre === nombre)?.venta ?? null;
}
