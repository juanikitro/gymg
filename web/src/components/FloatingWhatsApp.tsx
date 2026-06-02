export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5491162045433"
      aria-label="WhatsApp"
      className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-on-primary wa-pulse"
    >
      <span className="material-symbols-outlined">chat</span>
    </a>
  );
}
