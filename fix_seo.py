#!/usr/bin/env python3
# Mejorar SEO en index.html

html_content = '''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="Sistema de gestión de sellos e inventario para empresas. Administra productos, pedidos y clientes de forma eficiente." />
    <meta name="keywords" content="sellos, inventario, gestión, pedidos, administración" />
    <meta name="author" content="Sellos G" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Sellos G - Sistema de Gestión" />
    <meta property="og:description" content="Sistema de gestión de sellos e inventario para empresas" />
    <meta property="og:url" content="https://sellos-g.vercel.app" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Sellos G - Sistema de Gestión" />
    <meta name="twitter:description" content="Sistema de gestión de sellos e inventario" />
    
    <title>Sellos G - Sistema de Gestión de Inventario</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('✅ index.html mejorado con meta tags de SEO')
