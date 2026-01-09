// src/pages/admin/Dashboard.jsx
import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  Users, 
  Package, 
  FileText, 
  ShoppingCart, 
  Settings, 
  Building2, 
  LayoutDashboard,
  ClipboardList,
  BoxesIcon as Boxes,
  UserCog,
  BarChart3,
  Bell,
  MessagesSquare
} from 'lucide-react';
import notificationService from '../../services/notificationService';

// Importar páginas del admin
import DashboardHome from './sections/DashboardHome';
import CompanyData from './sections/CompanyData';
import AdminSettings from './sections/AdminSettings';
import Products from './sections/Products';
import Orders from './sections/Orders';
import UsersManagement from './sections/UsersManagement';
import Inventory from './sections/Inventory';
import Statistics from './sections/Statistics';
import Notifications from './sections/Notifications';
import Chat from './sections/Chat';

const AdminDashboard = () => { 
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastSeenRef = useRef(null);
  const initializedRef = useRef(false);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      const list = Array.isArray(response) ? response : response?.data || [];
      
      // Contar notificaciones no leídas
      const unread = list.filter(notif => notif.leida === false).length;
      setUnreadCount(unread);
      
      if (list.length === 0) return;

      const newest = list[0];

      // Primera carga: solo registrar el último visto para no disparar toast inicial
      if (!initializedRef.current) {
        lastSeenRef.current = newest.id;
        initializedRef.current = true;
        return;
      }

      // Si hay nueva notificación no leída, mostrar toast
      const isNew = newest.id && newest.id !== lastSeenRef.current;
      const isUnread = newest.leida === false;
      if (isNew && isUnread) {
        showToast(newest);
      }

      if (newest.id) {
        lastSeenRef.current = newest.id;
      }
    } catch (error) {
      // Silenciar errores para no romper el dashboard
      console.error('Error al obtener notificaciones:', error);
    }
  };

  const showToast = (notif) => {
    setToast({
      title: notif.titulo || 'Nueva notificación',
      message: notif.mensaje || 'Revisa tus notificaciones',
      tipo: notif.tipo || 'general'
    });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 20000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 role-admin">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Company Logo & Info */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-blue-400">Sellos-G</h1>
            <p className="text-sm text-slate-400 mt-1">Administrador</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`w-full flex items-center ui-nav-btn mb-1 ${
                  location.pathname === '/admin/dashboard' ? 'active' : ''
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Panel Principal
              </button>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Perfil y Empresa</p>
                <button
                  onClick={() => navigate('/admin/dashboard/empresa')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/empresa' ? 'active' : ''
                  }`}
                >
                  <Building2 className="w-5 h-5 mr-3 " />
                  Datos de Empresa
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/configuracion')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/configuracion' ? 'active' : ''
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3 " />
                  Configuración
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Gestión</p>
                <button
                  onClick={() => navigate('/admin/dashboard/productos')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/productos' ? 'active' : ''
                  }`}
                >
                  <Package className="w-5 h-5 mr-3 " />
                  Productos
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/pedidos')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/pedidos' ? 'active' : ''
                  }`}
                >
                  <ClipboardList className="w-5 h-5 mr-3 " />
                  Pedidos
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/inventario')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/inventario' ? 'active' : ''
                  }`}
                >
                  <Boxes className="w-5 h-5 mr-3 " />
                  Inventario
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/usuarios')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/usuarios' ? 'active' : ''
                  }`}
                >
                  <UserCog className="w-5 h-5 mr-3 " />
                  Usuarios
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Reportes</p>
                <button
                  onClick={() => navigate('/admin/dashboard/estadisticas')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/estadisticas' ? 'active' : ''
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3 " />
                  Estadísticas
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Comunicación</p>
                <button
                  onClick={() => navigate('/admin/dashboard/notificaciones')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/notificaciones' ? 'active' : ''
                  }`}
                >
                  <Bell className="w-5 h-5 mr-3 " />
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/chat')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/admin/dashboard/chat' ? 'active' : ''
                  }`}
                >
                  <MessagesSquare className="w-5 h-5 mr-3 " />
                  Chat
                </button>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{user?.nombre}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 flex items-center justify-center p-2 text-red-400 hover:bg-red-500/10 rounded-lg hover:text-red-300 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/empresa" element={<CompanyData />} />
              <Route path="/configuracion" element={<AdminSettings />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/pedidos" element={<Orders />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route path="/usuarios" element={<UsersManagement />} />
              <Route path="/estadisticas" element={<Statistics />} />
              <Route path="/notificaciones" element={<Notifications onNotificationsChange={fetchNotifications} />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </main>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="max-w-sm w-full ui-toast shadow-2xl overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <div className="ui-icon-badge">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold ui-title">{toast.title}</p>
                  <p className="text-sm ui-text mt-1">{toast.message}</p>
                  <button
                    onClick={() => navigate('/admin/dashboard/notificaciones')}
                    className="mt-3 text-sm font-medium ui-link-accent"
                  >
                    Ver notificaciones →
                  </button>
                </div>
                <button
                  onClick={() => setToast(null)}
                  className="text-slate-400 hover:text-slate-200 transition-colors text-xl leading-none"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminDashboard;
