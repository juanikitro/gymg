import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Paisaje de hacienda GyMG"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 w-full py-20">
        <div className="max-w-xl backdrop-blur-[2px] bg-background/75 rounded-2xl p-8 md:p-10 border border-white/30 shadow-2xl">
          <span className="inline-block px-3 py-1 bg-primary text-on-primary font-inter text-[12px] font-medium uppercase tracking-widest mb-6">
            Consignataria de Hacienda
          </span>

          <h1 className="font-garamond text-[36px] md:text-[48px] font-semibold leading-tight text-on-background mb-8 md:tracking-[-0.01em]">
            Compra y venta de hacienda con trato directo y respaldo familiar
          </h1>

          <p className="font-merriweather text-lg leading-[30px] text-on-surface-variant mb-10">
            Consignataria de hacienda de 25 de Mayo, Buenos Aires. Operamos gordos, invernada y cría,
            acompañando al productor con atención personalizada y más de 40 años de experiencia en el
            mercado ganadero.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a
              href="https://wa.me/5491162045433"
              className="inline-flex justify-center items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded font-inter text-sm font-semibold uppercase hover:bg-primary-container transition-colors"
            >
              Consultar por WhatsApp
            </a>
            <a
              href="tel:+541162045433"
              className="inline-flex justify-center items-center gap-2 border-2 border-on-background text-on-background px-8 py-4 rounded font-inter text-sm font-semibold uppercase hover:bg-on-background hover:text-white transition-all"
            >
              Llamar ahora
            </a>
          </div>

          <div className="flex items-center gap-3 text-on-surface-variant opacity-80">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
            <p className="font-inter text-[12px] font-medium italic">
              Respuesta directa. Consultas por compra, venta o valores de hacienda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
