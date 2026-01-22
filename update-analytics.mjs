import fs from 'fs';

const path = './src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Agregar import de Analytics
content = content.replace(
  "import { BrowserRouter } from 'react-router-dom';",
  "import { BrowserRouter } from 'react-router-dom';\nimport { Analytics } from '@vercel/analytics/react';"
);

// Agregar componente Analytics
content = content.replace(
  "          </AppRoutes>",
  "          </AppRoutes>\n        <Analytics />"
);

fs.writeFileSync(path, content, 'utf8');
console.log('✅ App.jsx actualizado con Vercel Analytics');
