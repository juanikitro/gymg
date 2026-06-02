# Deploy en Donweb

## Build
  cd web
  npm run build
  # Genera: web/out/

## Subir a Donweb (opción A — FileZilla)
1. Abrir FileZilla
2. Host: ftp.gymg.com.ar (o el host FTP que aparece en cPanel)
   User / Password: credenciales FTP del cPanel
   Port: 21
3. En el panel remoto, navegar a public_html/
4. Seleccionar TODO el contenido de web/out/ (no la carpeta out en sí,
   sino su contenido: index.html, _next/, .htaccess, etc.)
5. Arrastrar al panel remoto → public_html/

## Subir a Donweb (opción B — cPanel File Manager)
1. Comprimir web/out/ en out.zip
2. En cPanel → File Manager → public_html/ → Upload → subir out.zip
3. Clic derecho sobre out.zip → Extract → extraer en public_html/
4. Verificar que index.html esté directamente en public_html/ (no en
   public_html/out/)
5. Eliminar out.zip

## SSL (HTTPS)
cPanel → SSL/TLS → Let's Encrypt → emitir certificado para gymg.com.ar
y [www.gymg.com.ar](https://www.gymg.com.ar) → activar HTTPS obligatorio (Force HTTPS).

## Actualizar el sitio
Cada vez que hagas cambios:
  npm run build   (en web/)
  # Subir de nuevo el contenido de out/ a public_html/ sobreescribiendo
