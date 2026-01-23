// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="h-screen w-full">
          <AppRoutes />
        </main>
        <Analytics />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;