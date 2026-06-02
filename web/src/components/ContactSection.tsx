export default function ContactSection() {
  return (
    <section id="contacto" className="py-16 md:py-[120px] bg-background scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-0 border border-outline">
          {/* Contact info */}
          <div className="p-10 lg:p-20 bg-surface-container-lowest">
            <h2 className="font-garamond text-[32px] font-medium leading-[40px] mb-8">
              Hablemos de tu próxima operación
            </h2>

            <div className="space-y-10">
              <div>
                <h4 className="font-inter text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                  Atención Directa
                </h4>
                <p className="font-garamond text-[24px] font-medium leading-[32px]">
                  Rafael &amp; Germán Gutiérrez
                </p>
                <p className="font-merriweather text-base leading-[26px] text-on-surface-variant">
                  Socios Fundadores
                </p>
              </div>

              <div>
                <h4 className="font-inter text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                  Ubicación
                </h4>
                <p className="font-merriweather text-base leading-[26px]">
                  25 de Mayo, Provincia de Buenos Aires, Argentina.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <a
                  href="tel:+541162045433"
                  className="bg-primary text-on-primary px-6 py-3 rounded font-inter text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>call</span>
                  Llamar ahora
                </a>
                <a
                  href="mailto:ggutierrez@gymg.com.ar"
                  className="border border-outline px-6 py-3 rounded font-inter text-sm font-semibold flex items-center gap-2 hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
                  Enviar Email
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="relative bg-surface-container-low min-h-[400px]">
            <iframe
              src="https://maps.google.com/maps?q=-35.4279583,-60.1712214&z=16&output=embed"
              className="absolute inset-0 w-full h-full"
              title="Ubicación GyMG — 25 de Mayo, Buenos Aires"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
