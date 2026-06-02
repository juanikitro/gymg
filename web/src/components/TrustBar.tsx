const stats = [
  { icon: "groups", label: "Empresa familiar" },
  { icon: "calendar_today", label: "Fundada en 2012" },
  { icon: "verified", label: "+40 años de experiencia" },
  { icon: "map", label: "Presencia en 5 provincias" },
];

export default function TrustBar() {
  return (
    <section className="bg-surface-container-low border-y border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center ${
                i < stats.length - 1 ? "md:border-r border-outline-variant" : ""
              }`}
            >
              <span className="material-symbols-outlined text-primary mb-2">{stat.icon}</span>
              <p className="font-inter text-sm font-semibold text-on-surface">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
