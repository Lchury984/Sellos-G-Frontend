#!/usr/bin/env python3
# Silenciar errores de consola en producción

with open('src/services/companyService.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Cambiar console.error por advertencia solo en desarrollo
content = content.replace(
    "      console.error('Error obteniendo configuración:', error);",
    "      if (import.meta.env.DEV) console.warn('Error obteniendo configuración:', error);"
)

with open('src/services/companyService.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ companyService.js: errores solo en desarrollo')
