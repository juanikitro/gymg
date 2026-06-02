"use client";

import { useRef } from "react";
import Image from "next/image";
import { useFadeInUp } from "@/hooks/useFadeInUp";

const highlights = [
  {
    title: "Trato directo con Rafael y Germán",
    description: "Sin intermediarios ni demoras.",
  },
  {
    title: "Empresa familiar de 25 de Mayo",
    description: "Arraigo y compromiso con nuestra comunidad.",
  },
  {
    title: "Red comercial federal",
    description: "Operamos en Buenos Aires, Santa Fe, Córdoba, La Pampa y el litoral.",
  },
  {
    title: "Operaciones claras",
    description: "Seguimiento personal en cada etapa del cierre.",
  },
];

export default function WhyChooseSection() {
  const liRef0 = useRef<HTMLLIElement>(null);
  const liRef1 = useRef<HTMLLIElement>(null);
  const liRef2 = useRef<HTMLLIElement>(null);
  const liRef3 = useRef<HTMLLIElement>(null);
  useFadeInUp(liRef0);
  useFadeInUp(liRef1);
  useFadeInUp(liRef2);
  useFadeInUp(liRef3);
  const liRefs = [liRef0, liRef1, liRef2, liRef3];

  return (
    <section id="nosotros" className="py-16 md:py-[120px] bg-surface-container-low overflow-hidden scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-[4/5] border border-outline overflow-hidden">
                <Image
                  src="/portrait.jpg"
                  alt="Rafael y Germán Gutiérrez de GyMG"
                  fill
                  className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary-container/10 -z-10" />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 lg:pl-12">
            <h2 className="font-garamond text-[32px] font-medium leading-[40px] text-on-background mb-6">
              Una consignataria cerca del productor
            </h2>
            <p className="font-merriweather text-lg leading-[30px] text-on-surface-variant mb-10">
              En GyMG trabajamos con una lógica simple: conocer al productor, entender la necesidad y
              buscar la mejor alternativa comercial posible.
            </p>

            <ul className="space-y-6 mb-12">
              {highlights.map((item, i) => (
                <li key={item.title} ref={liRefs[i]} className="fade-in-up flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary font-bold mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-inter text-sm font-semibold text-on-background">
                      {item.title}
                    </h4>
                    <p className="font-merriweather text-sm leading-[22px] text-on-surface-variant mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/5491162045433"
              className="inline-flex justify-center items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded font-inter text-sm font-semibold uppercase hover:bg-primary-container transition-colors"
            >
              Hablar con GyMG
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
