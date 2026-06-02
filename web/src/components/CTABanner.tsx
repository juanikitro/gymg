"use client";

import { useRef } from "react";
import { useFadeInUp } from "@/hooks/useFadeInUp";

export default function CTABanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  useFadeInUp(containerRef);

  return (
    <section className="py-20 bg-primary text-on-primary">
      <div ref={containerRef} className="fade-in-up max-w-[1280px] mx-auto px-5 md:px-8 text-center">
        <h2 className="font-garamond text-[32px] font-medium leading-[40px] mb-6">
          Consultá disponibilidad y oportunidades del momento
        </h2>
        <p className="font-merriweather text-lg leading-[30px] mb-10 opacity-90 max-w-2xl mx-auto">
          Escribinos y te contamos qué operaciones hay activas en este momento para gordo, invernada o
          cría.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://wa.me/5491162045433"
            className="bg-white text-primary px-8 py-4 rounded font-inter text-sm font-semibold uppercase hover:bg-surface-container transition-colors"
          >
            Enviar WhatsApp
          </a>
          <a
            href="tel:+541162045433"
            className="border-2 border-white text-white px-8 py-4 rounded font-inter text-sm font-semibold uppercase hover:bg-white/10 transition-colors"
          >
            Hablar por teléfono
          </a>
        </div>
      </div>
    </section>
  );
}
