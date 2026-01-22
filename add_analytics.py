#!/usr/bin/env python3
# Actualizar App.jsx con Vercel Analytics

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Agregar import de Analytics
content = content.replace(
    "import { BrowserRouter } from 'react-router-dom';",
    "import { BrowserRouter } from 'react-router-dom';\nimport { Analytics } from '@vercel/analytics/react';"
)

# Agregar componente Analytics
content = content.replace(
    '        </div>\n      </AuthProvider>',
    '        </div>\n        <Analytics />\n      </AuthProvider>'
)

with open('src/App.jsx', 'w') as f:
    f.write(content)

print('✅ App.jsx actualizado con Vercel Analytics')
