"use client";

import { useRef } from "react";
import { useFadeInUp } from "@/hooks/useFadeInUp";

const categories = [
  {
    icon: "restaurant",
    title: "Gordo",
    description:
      "Hacienda con destino a faena, según disponibilidad, mercado y condiciones de operación.",
    cta: "Consultar por gordo",
  },
  {
    icon: "trending_up",
    title: "Invernada",
    description: "Compra y venta de categorías de recría para productores y compradores.",
    cta: "Consultar por invernada",
  },
  {
    icon: "pets",
    title: "Cría",
    description: "Operaciones vinculadas a vientres, vacas, vaquillonas y rodeos de cría.",
    cta: "Consultar por cría",
  },
];

export default function OperationsSection() {
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  useFadeInUp(ref0, 0);
  useFadeInUp(ref1, 100);
  useFadeInUp(ref2, 200);
  const cardRefs = [ref0, ref1, ref2];

  return (
    <section id="operaciones" className="py-16 md:py-[120px] bg-background scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="font-garamond text-[32px] font-medium leading-[40px] text-on-background mb-4">
              Operamos hacienda en las principales categorías
            </h2>
            <p className="font-merriweather text-base leading-[26px] text-on-surface-variant">
              Acompañamos a productores, compradores y vendedores en operaciones claras, con atención
              directa y conocimiento del mercado.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              ref={cardRefs[i]}
              className="fade-in-up group border border-outline p-8 bg-surface-container-lowest hover:bg-surface-container transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <h3 className="font-garamond text-[24px] font-medium leading-[32px] text-on-background mb-4">
                {cat.title}
              </h3>
              <p className="font-merriweather text-base leading-[26px] text-on-surface-variant mb-8 min-h-[80px]">
                {cat.description}
              </p>
              <a
                href="https://wa.me/5491162045433"
                className="inline-flex items-center gap-2 text-primary font-inter text-sm font-semibold hover:translate-x-1 transition-transform"
              >
                {cat.cta}
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
