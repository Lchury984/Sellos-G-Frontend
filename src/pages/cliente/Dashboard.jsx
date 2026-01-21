// src/pages/cliente/Dashboard.jsx
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';
import {
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Clock,
  MessageSquare,
  Bell,
  User,
} from 'lucide-react';

// Importar secciones del cliente
import DashboardHome from './sections/DashboardHome';
import Catalog from './sections/Catalog';
import RealizarPedido from './RealizarPedido';
import OrderTracking from './sections/OrderTracking';
import EditProfile from './sections/EditProfile';
import Notifications from './sections/Notifications';
import Chat from './sections/Chat';

const ClienteDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalIdRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getNotifications();
      const list = Array.isArray(response) ? response : response?.data || [];
      const unread = list.filter(notif => notif.leida === false).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    intervalIdRef.current = setInterval(fetchUnreadCount, 20000);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 role-cliente">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-emerald-400">Sellos-G</h1>
            <p className="text-sm text-slate-400 mt-1">Cliente</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/cliente/dashboard')}
                className={`w-full flex items-center ui-nav-btn mb-1 ${
                  location.pathname === '/cliente/dashboard' ? 'active' : ''
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3 " />
                Panel Principal
              </button>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Gestión de Pedidos
                </p>
                <button
                  onClick={() => navigate('/cliente/dashboard/catalogo')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/cliente/dashboard/catalogo' ? 'active' : ''
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-3 " />
                  Catálogo
                </button>
                <button
                  onClick={() => navigate('/cliente/dashboard/realizar-pedido')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/cliente/dashboard/realizar-pedido' ? 'active' : ''
                  }`}
                >
                  <Package className="w-5 h-5 mr-3 " />
                  Realizar Pedido
                </button>
                <button
                  onClick={() => navigate('/cliente/dashboard/seguimiento')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/cliente/dashboard/seguimiento' ? 'active' : ''
                  }`}
                >
                  <Clock className="w-5 h-5 mr-3 " />
                  Seguimiento
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Perfil</p>
                <button
                  onClick={() => navigate('/cliente/dashboard/editar-perfil')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/cliente/dashboard/editar-perfil' ? 'active' : ''
                  }`}
                >
                  <User className="w-5 h-5 mr-3 " />
                  Editar Perfil
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Comunicación
                </p>
                <button
                  onClick={() => navigate('/cliente/dashboard/notificaciones')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/cliente/dashboard/notificaciones' ? 'active' : ''
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
                  onClick={() => navigate('/cliente/dashboard/chat')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/cliente/dashboard/chat' ? 'active' : ''
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-3 " />
                  Chat
                </button>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {user?.nombre || 'Cliente'}
                </p>
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
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/realizar-pedido" element={<RealizarPedido />} />
              <Route path="/seguimiento" element={<OrderTracking />} />
              <Route path="/editar-perfil" element={<EditProfile />} />
              <Route path="/notificaciones" element={<Notifications onNotificationsChange={fetchUnreadCount} />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClienteDashboard;
