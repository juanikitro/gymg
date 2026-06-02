const regions = [
  { name: "BUENOS AIRES", description: "Base operativa 25 de Mayo y alrededores." },
  { name: "SANTA FE", description: "Vínculos comerciales zona núcleo." },
  { name: "CÓRDOBA", description: "Operaciones de invernada y cría." },
  { name: "LITORAL", description: "Presencia en Entre Ríos y Corrientes." },
];

export default function ZonesSection() {
  return (
    <section id="zonas" className="py-16 md:py-[120px] bg-surface-container-highest scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div>
            <h2 className="font-garamond text-[32px] font-medium leading-[40px] text-on-background mb-6">
              Trabajamos en distintas regiones ganaderas
            </h2>
            <p className="font-merriweather text-lg leading-[30px] text-on-surface-variant mb-12">
              Comercializamos hacienda en Buenos Aires, Santa Fe, Córdoba, La Pampa y el litoral,
              desde nuestras oficinas centrales en 25 de Mayo.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {regions.map((region) => (
                <div key={region.name} className="p-6 bg-surface-container-lowest border border-outline-variant">
                  <p className="font-inter text-sm font-semibold text-primary mb-2">{region.name}</p>
                  <p className="font-merriweather text-sm leading-[22px] text-on-surface-variant">
                    {region.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Map visual */}
          <div
            className="relative min-h-[400px] border border-outline flex items-center justify-center p-12 overflow-hidden"
            style={{
              backgroundImage: "url('/map-argentina.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Darkening overlay */}
            <div className="absolute inset-0 bg-black/55 pointer-events-none" />
            <div className="relative z-10 text-center">
              <span
                className="material-symbols-outlined text-white/40 mb-4 block"
                style={{ fontSize: 100 }}
              >
                distance
              </span>
              <h3 className="font-garamond text-[24px] font-medium leading-[32px] italic text-white">
                &quot;Donde hay hacienda, estamos nosotros&quot;
              </h3>
              <p className="font-inter text-[12px] font-medium mt-4 text-white/60">
                Operativa nacional — Soporte local
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
