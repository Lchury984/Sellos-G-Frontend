// src/pages/public/Landing.jsx
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MessageSquare, 
  Package, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Package,
      title: 'Gestión de Inventario',
      description: 'Control completo de tu inventario de sellos en tiempo real'
    },
    {
      icon: MessageSquare,
      title: 'Chat en Tiempo Real',
      description: 'Comunicación directa con clientes y empleados'
    },
    {
      icon: TrendingUp,
      title: 'Pedidos Automatizados',
      description: 'Sistema de pedidos eficiente con seguimiento completo'
    },
    {
      icon: Users,
      title: 'Multi-Usuario',
      description: 'Roles diferenciados: Admin, Empleados y Clientes'
    },
    {
      icon: Clock,
      title: 'Notificaciones',
      description: 'Alertas instantáneas de pedidos y mensajes'
    },
    {
      icon: ShieldCheck,
      title: 'Seguro y Confiable',
      description: 'Verificación de cuentas y autenticación segura'
    }
  ];

  const steps = [
    { number: '01', title: 'Regístrate', desc: 'Crea tu cuenta de cliente en segundos' },
    { number: '02', title: 'Verifica', desc: 'Confirma tu email y activa tu cuenta' },
    { number: '03', title: 'Explora', desc: 'Navega el catálogo de productos' },
    { number: '04', title: 'Pide', desc: 'Realiza pedidos y chatea con soporte' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header/Navbar */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sellos-G
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Sistema de Gestión Profesional</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Gestiona tus Sellos
            </span>
            <br />
            <span className="text-white">
              de Forma Inteligente
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto">
            Plataforma completa para administrar inventario, pedidos y comunicación 
            con tus clientes en tiempo real. Todo en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Comenzar Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#caracteristicas"
              className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors"
            >
              Ver Características
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-slate-400">
              Todo lo que necesitas para gestionar tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-slate-400">
              Comienza en 4 simples pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-br from-blue-500/20 to-purple-600/20 bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent -translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para Empezar?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Únete a nuestra plataforma y lleva tu negocio al siguiente nivel
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all"
          >
            Crear Cuenta Gratis
            <CheckCircle2 className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Sellos-G</span>
            </div>
            <p className="text-slate-400 text-center">
              © 2026 Sellos-G. Sistema de Gestión Profesional.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
