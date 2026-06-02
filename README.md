# GyMG — Consignataria de Hacienda

Landing page institucional de **GyMG**, consignataria de hacienda (ganado) de **Rafael y Germán Gutiérrez**, con base en **25 de Mayo, provincia de Buenos Aires, Argentina**.

El sitio presenta la empresa, sus servicios y zonas de operación, y ofrece canales de contacto directo (WhatsApp, Instagram y email) para productores y clientes del sector ganadero.

Es un sitio **estático** (sin backend): se construye como HTML/CSS/JS plano y se publica en hosting compartido **Donweb** (Apache/cPanel).

---

## Stack tecnológico

| Tecnología | Versión | Notas |
| --- | --- | --- |
| [Next.js](https://nextjs.org) | `16.2.6` | App Router + export estático (`output: "export"`) |
| [React](https://react.dev) | `19.2.4` | |
| React DOM | `19.2.4` | |
| [TypeScript](https://www.typescriptlang.org) | `^5` | |
| [Tailwind CSS](https://tailwindcss.com) | `v4` | vía `@tailwindcss/postcss` `^4` |
| [ESLint](https://eslint.org) | `^9` | con `eslint-config-next` `16.2.6` |
| Node.js | `≥ 20.9.0` | requerido por Next.js 16 |

Detalles de presentación:

- **Dark mode** mediante el atributo `data-theme` en `<html>` (toggle en la barra superior).
- Tipografías **EB Garamond**, **Merriweather** e **Inter**.
- Íconos **Material Symbols**.

---

## Estructura del repositorio

Este es un **monorepo**. La aplicación real vive en `web/`; el resto son assets de diseño de referencia.

```
GYMG/
├── web/                                   # Aplicación real (Next.js) — el código de producción
├── stitch_export/                         # Prototipos de diseño (solo referencia visual)
├── stitch_gymg_consignataria_landing_page.zip   # Los mismos assets de diseño, comprimidos
├── .claude/launch.json                    # Config de arranque local (puerto 3001)
└── README.md
```

### `web/` — la aplicación

```
web/
├── src/
│   ├── app/              # App Router
│   │   ├── layout.tsx    # Layout raíz, fuentes y metadata
│   │   ├── page.tsx      # Página principal (compone las secciones)
│   │   ├── globals.css   # Estilos globales + tema (Tailwind v4)
│   │   ├── manifest.ts   # Web App Manifest
│   │   ├── robots.ts     # robots.txt
│   │   └── sitemap.ts    # sitemap.xml
│   ├── components/       # Secciones de la landing (Hero, TrustBar, Process,
│   │                     # Operations, Zones, Contact, Footer, ThemeToggle, etc.)
│   └── hooks/            # useTheme (dark mode), useFadeInUp (animaciones)
├── public/              # Imágenes, favicon y .htaccess (reglas para Apache)
├── next.config.ts       # output: "export" → genera web/out/
├── DEPLOY.md            # Guía de deploy a Donweb
└── package.json
```

### `stitch_export/` — prototipos de diseño

Contiene los **prototipos originales** generados con la herramienta [Stitch](https://stitch.withgoogle.com/) (HTML + imágenes hechas con IA): distintas variantes visuales (`gymg_landing_page_desktop`, `gymg_premium_heritage_edition`, `gymg_sober_heritage_edition`, etc.), cada una con su `code.html` y su `screen.png`. Se usaron **solo como referencia visual**; todo el código de `web/` se escribió desde cero. El archivo `stitch_gymg_consignataria_landing_page.zip` en la raíz es una copia comprimida de estos mismos assets.

> ⚠️ **No es código de producción.** Nada de `stitch_export/` se compila ni se despliega.

---

## Requisitos previos

- **Node.js** `≥ 20.9.0` (recomendado: la última LTS).
- **npm** (incluido con Node.js).

Verificá tu versión con:

```bash
node --version
npm --version
```

---

## Desarrollo local

Desde la raíz del repo, posicionate en `web/`, instalá dependencias y levantá el servidor de desarrollo:

```bash
cd web
npm install
npm run dev
```

El sitio queda disponible en **http://localhost:3001** (puerto configurado para el proyecto). El servidor usa Turbopack y recarga automáticamente al guardar cambios.

---

## Build del export estático

Para generar la versión estática lista para publicar:

```bash
cd web
npm run build
```

Esto produce la carpeta **`web/out/`** con todo el sitio en HTML/CSS/JS plano (gracias a `output: "export"` en `next.config.ts`). Ese es el contenido que se sube al hosting.

Para previsualizar el export localmente antes de subirlo:

```bash
npm run preview   # sirve web/out/ con `npx serve`
```

---

## Deploy a Donweb

El sitio se publica en **Donweb** (hosting compartido Apache/cPanel) — **no usa Vercel**.

Resumen del flujo:

1. `cd web && npm run build` → genera `web/out/`.
2. Subir **el contenido** de `web/out/` (no la carpeta en sí) a `public_html/` del hosting, vía **FTP (FileZilla)** o **File Manager de cPanel**.
3. Asegurarse de que `index.html` quede directamente en `public_html/`.
4. Activar **SSL (Let's Encrypt)** y forzar HTTPS desde cPanel.

Cada actualización repite el ciclo: `npm run build` → subir el contenido de `out/` sobreescribiendo.

📄 **Pasos detallados:** [`web/DEPLOY.md`](web/DEPLOY.md)

---

## Contacto del negocio

- **WhatsApp:** [wa.me/5491162045433](https://wa.me/5491162045433)
- **Instagram:** [@gymgde25](https://www.instagram.com/gymgde25)
- **Email:** [ggutierrez@gymg.com.ar](mailto:ggutierrez@gymg.com.ar)
