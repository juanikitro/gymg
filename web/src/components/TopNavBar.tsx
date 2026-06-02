"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "#operaciones", label: "Operaciones" },
  { href: "#zonas", label: "Zonas" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export default function TopNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 180);
  };

  const toggleMenu = () => (menuOpen ? closeMenu() : setMenuOpen(true));

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.4 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-background border-b border-outline transition-shadow duration-200${scrolled ? " shadow-md" : ""}`}
    >
      <div className="max-w-[1280px] mx-auto flex justify-between items-center px-5 md:px-8 h-20">
        {/* Logo */}
        <a href="/" aria-label="GyMG — Consignataria de Hacienda">
          <img src="/logo.png"      alt="GyMG Consignataria" className="logo-light h-14 w-auto" />
          <img src="/logo-dark.png" alt="GyMG Consignataria" className="logo-dark  h-14 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-inter text-sm tracking-wide transition-colors duration-200 ${
                activeSection === link.href
                  ? "text-primary font-bold"
                  : "font-semibold text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://www.instagram.com/gymgde25"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de GyMG"
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          <a
            href="https://wa.me/5491162045433"
            className="hidden md:inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-inter text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
            WhatsApp
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-primary transition-transform active:scale-90"
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span className={`material-symbols-outlined transition-transform duration-200 ${menuOpen && !menuClosing ? "rotate-90" : "rotate-0"}`}>
              {menuOpen && !menuClosing ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden bg-background border-t border-outline-variant px-5 py-6 flex flex-col gap-5 ${menuClosing ? "menu-exit" : "menu-enter"}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`font-inter text-sm tracking-wide transition-colors ${
                activeSection === link.href
                  ? "text-primary font-bold"
                  : "font-semibold text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/5491162045433"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded font-inter text-sm font-semibold"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/gymgde25"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de GyMG"
              className="inline-flex items-center justify-center w-10 h-10 rounded border border-outline text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
