// src/pages/public/Landing.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MessageSquare, 
  Stamp, 
  Palette, 
  Megaphone, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Award,
  Truck,
  Clock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import companyService from '../../services/companyService';

const Landing = () => {
  const [companyData, setCompanyData] = useState({
    nombre: 'Sellos-G',
    descripcion: 'Especialistas en la creación de sellos únicos y materiales publicitarios de alta calidad. Convierte tus ideas en realidad con diseños profesionales que destacan tu marca.',
    email: 'info@sellos-g.com',
    telefono: '+503 0000-0000',
    direccion: 'San Salvador, El Salvador',
    logoUrl: '',
    tagline: 'Sellos y Publicidad desde 2015'
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await companyService.getSettings();
        setCompanyData(data);
      } catch (error) {
        console.error('Error cargando configuración:', error);
      }
    };
    fetchCompanyData();
  }, []);
  const services = [
    {
      icon: Stamp,
      title: 'Sellos Personalizados',
      description: 'Diseña tu sello único con tu logo, nombre o mensaje. Calidad garantizada en cada impresión.'
    },
    {
      icon: Palette,
      title: 'Diseño Creativo',
      description: 'Nuestro equipo de diseñadores crea sellos profesionales adaptados a tu marca y necesidades.'
    },
    {
      icon: Megaphone,
      title: 'Publicidad y Marketing',
      description: 'Materiales publicitarios personalizados: banners, volantes, tarjetas y más para impulsar tu negocio.'
    },
    {
      icon: Award,
      title: 'Calidad Premium',
      description: 'Materiales de primera calidad y tintas duraderas que garantizan resultados profesionales.'
    },
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Procesamos y entregamos tus pedidos en tiempo récord sin comprometer la calidad.'
    },
    {
      icon: Clock,
      title: 'Atención 24/7',
      description: 'Soporte al cliente siempre disponible para cotizaciones, consultas y seguimiento de pedidos.'
    }
  ];

  const products = [
    'Sellos Automáticos',
    'Sellos Manuales',
    'Sellos Corporativos',
    'Sellos Fechadores',
    'Banners Publicitarios',
    'Material POP',
    'Tarjetas de Presentación',
    'Volantes y Folletos'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header/Navbar */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {companyData.logoUrl ? (
                <img src={companyData.logoUrl} alt="Logo" className="h-8 w-auto" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Stamp className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {companyData.nombre}
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
                Cotizar Ahora
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
            <span className="text-sm text-purple-300">{companyData.tagline}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sellos Personalizados
            </span>
            <br />
            <span className="text-white">
              & Material Publicitario
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto">
            {companyData.descripcion}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Solicitar Cotización
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#servicios"
              className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors"
            >
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-slate-400">
              Soluciones completas para tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-8 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Catálogo de Productos
            </h2>
            <p className="text-xl text-slate-400">
              Todo lo que necesitas en un solo lugar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {products.map((product, index) => (
              <div
                key={index}
                className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl text-center hover:border-purple-500/50 hover:bg-slate-800 transition-all"
              >
                <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-medium text-sm">{product}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Tienes un Diseño en Mente?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Creamos sellos completamente personalizados según tus especificaciones. 
                Desde logos corporativos hasta diseños únicos, nuestro equipo hace realidad 
                tu visión con la más alta calidad.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Diseño personalizado incluido sin costo adicional</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Revisiones ilimitadas hasta tu aprobación</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Muestra digital antes de producción</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Entrega en 3-5 días hábiles</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Crear Mi Sello Personalizado
                <Palette className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl border border-slate-700 flex items-center justify-center">
                <Stamp className="w-32 h-32 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Crea tu cuenta, cotiza tu proyecto y recibe atención personalizada. 
            Chat en tiempo real con nuestro equipo para resolver todas tus dudas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-900 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all"
            >
              Solicitar Cotización
              <MessageSquare className="w-6 h-6" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-10 py-5 bg-slate-800 border border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all"
            >
              Ver Catálogo Completo
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Logo y Nombre */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {companyData.logoUrl ? (
                  <img src={companyData.logoUrl} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Stamp className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="text-xl font-bold text-white">{companyData.nombre}</span>
              </div>
              <p className="text-slate-400 text-sm">
                {companyData.tagline}
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
              <div className="space-y-3 text-slate-400 text-sm">
                {companyData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${companyData.email}`} className="hover:text-white transition-colors">
                      {companyData.email}
                    </a>
                  </div>
                )}
                {companyData.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${companyData.telefono}`} className="hover:text-white transition-colors">
                      {companyData.telefono}
                    </a>
                  </div>
                )}
                {companyData.direccion && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{companyData.direccion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
              <div className="flex flex-col gap-2 text-slate-400 text-sm">
                <Link to="/login" className="hover:text-white transition-colors">
                  Cotizar
                </Link>
                <Link to="/login" className="hover:text-white transition-colors">
                  Catálogo
                </Link>
                <a href={`mailto:${companyData.email}`} className="hover:text-white transition-colors">
                  Contacto
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {companyData.nombre}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
