import TopNavBar from "@/components/TopNavBar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import OperationsSection from "@/components/OperationsSection";
import PreciosReferencia from "@/components/PreciosReferencia";
import WhyChooseSection from "@/components/WhyChooseSection";
import ProcessSection from "@/components/ProcessSection";
import ZonesSection from "@/components/ZonesSection";
import CTABanner from "@/components/CTABanner";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "GyMG Consignataria de Hacienda",
  url: "https://gymg.com.ar",
  telephone: "+541162045433",
  email: "ggutierrez@gymg.com.ar",
  address: {
    "@type": "PostalAddress",
    addressLocality: "25 de Mayo",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  description:
    "Consignataria de hacienda en 25 de Mayo, Buenos Aires. Operamos gordos, invernada y cría con más de 40 años de experiencia en el mercado ganadero argentino.",
  sameAs: [],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <TopNavBar />
      <main className="mt-20">
        <HeroSection />
        <TrustBar />
        <OperationsSection />
        <PreciosReferencia />
        <WhyChooseSection />
        <ProcessSection />
        <ZonesSection />
        <CTABanner />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
