#!/usr/bin/env python3
# Mejorar accesibilidad en App.jsx

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Cambiar div por main para landmark
content = content.replace(
    '        <div className="h-screen w-full">',
    '        <main className="h-screen w-full">'
)

content = content.replace(
    '        </div>\n        <Analytics />',
    '        </main>\n        <Analytics />'
)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ App.jsx: agregado <main> landmark para accesibilidad')
