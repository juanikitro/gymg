"use client";

import { useRef } from "react";
import { useFadeInUp } from "@/hooks/useFadeInUp";

const steps = [
  {
    number: "1",
    title: "Consulta Inicial",
    description: "Nos contás qué querés vender o comprar.",
  },
  {
    number: "2",
    title: "Evaluación",
    description: "Evaluamos categoría, zona, mercado y condiciones.",
  },
  {
    number: "3",
    title: "Match Comercial",
    description: "Buscamos comprador o vendedor adecuado.",
  },
  {
    number: "4",
    title: "Cierre",
    description: "Coordinamos la operación y acompañamos el cierre.",
  },
];

export default function ProcessSection() {
  const stepRef0 = useRef<HTMLDivElement>(null);
  const stepRef1 = useRef<HTMLDivElement>(null);
  const stepRef2 = useRef<HTMLDivElement>(null);
  const stepRef3 = useRef<HTMLDivElement>(null);
  useFadeInUp(stepRef0);
  useFadeInUp(stepRef1);
  useFadeInUp(stepRef2);
  useFadeInUp(stepRef3);
  const stepRefs = [stepRef0, stepRef1, stepRef2, stepRef3];

  return (
    <section className="py-16 md:py-[120px] bg-background">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="text-center mb-20">
          <h2 className="font-garamond text-[32px] font-medium leading-[40px] text-on-background mb-4">
            De la consulta al cierre de la operación
          </h2>
          <p className="font-merriweather text-base leading-[26px] text-on-surface-variant max-w-2xl mx-auto">
            Nuestro proceso es ágil y transparente, diseñado para brindarle tranquilidad al productor
            en cada paso.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, i) => (
            <div key={step.number} ref={stepRefs[i]} className="fade-in-up relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center font-garamond text-[24px] font-medium text-primary mb-6 bg-background z-10">
                {step.number}
              </div>
              <h4 className="font-inter text-sm font-semibold mb-3 text-on-background">
                {step.title}
              </h4>
              <p className="font-merriweather text-sm leading-[22px] text-on-surface-variant">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-outline-variant" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a
            href="https://wa.me/5491162045433"
            className="inline-flex justify-center items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded font-inter text-sm font-semibold uppercase hover:bg-primary-container transition-colors"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
