import type { Metadata, Viewport } from "next";
import { EB_Garamond, Merriweather, Inter } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-garamond-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather-var",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

// TODO: replace /public/og-image.png with a 1200×630 branded image before launch
const DESCRIPTION =
  "Consignataria de hacienda en 25 de Mayo, Buenos Aires. Operamos gordos, invernada y cría con más de 40 años de experiencia en el mercado ganadero argentino.";

export const metadata: Metadata = {
  metadataBase: new URL("https://gymg.com.ar"),
  title: {
    default: "GyMG | Consignataria de Hacienda",
    template: "%s | GyMG",
  },
  description: DESCRIPTION,
  keywords: [
    "consignataria",
    "hacienda",
    "ganadería",
    "gordo",
    "invernada",
    "cría",
    "remate",
    "hacienda vacuna",
    "25 de Mayo",
    "Buenos Aires",
    "venta de hacienda",
    "compra de hacienda",
  ],
  authors: [{ name: "GyMG Consignataria" }],
  openGraph: {
    type: "website",
    url: "https://gymg.com.ar",
    siteName: "GyMG",
    title: "GyMG | Consignataria de Hacienda",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GyMG Consignataria de Hacienda — 25 de Mayo, Buenos Aires",
      },
    ],
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "GyMG | Consignataria de Hacienda",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://gymg.com.ar",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${ebGaramond.variable} ${merriweather.variable} ${inter.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* Apply stored theme before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('theme');document.documentElement.dataset.theme=s||'light';})()` }} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-merriweather antialiased">{children}</body>
    </html>
  );
}
