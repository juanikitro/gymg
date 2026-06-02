const footerLinks = [
  { href: "#operaciones", label: "Operaciones" },
  { href: "#zonas", label: "Zonas" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-highest border-t border-outline">
      <div className="max-w-[1280px] mx-auto py-16 px-5 md:px-8 flex flex-col items-center gap-8">
        <a href="/" aria-label="GyMG — Consignataria de Hacienda">
          <img src="/logo.png"      alt="GyMG Consignataria" className="logo-light h-24 w-auto" />
          <img src="/logo-dark.png" alt="GyMG Consignataria" className="logo-dark  h-24 w-auto" />
        </a>

        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-inter text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="https://www.instagram.com/gymgde25"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de GyMG"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline text-on-surface-variant hover:text-primary hover:border-primary transition-colors font-inter text-sm font-medium"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          @gymgde25
        </a>

        <div className="w-full h-px bg-outline-variant" />

        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <p className="font-merriweather text-[12px] text-on-surface-variant text-center md:text-left italic">
            &quot;Tradición y seriedad en el mercado de hacienda.&quot;
          </p>
          <div className="font-inter text-[12px] text-on-surface-variant">
            © {new Date().getFullYear()} GyMG Consignataria de Hacienda. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
