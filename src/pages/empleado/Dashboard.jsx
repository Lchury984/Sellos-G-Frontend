import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  LayoutDashboard,
  Clipboard,
  ShoppingCart,
  User,
  Bell,
  MessageSquare,
  MessagesSquare,
  Inbox,
} from 'lucide-react';
import api from '../../services/api';
import notificationService from '../../services/notificationService';
import AssignedOrders from './sections/AssignedOrders';
import Chat from './sections/Chat';
import EditProfile from './sections/EditProfile';
import Notifications from './sections/Notifications';

// Panel principal con tarjetas-resumen
const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pedidos: 0, noLeidas: 0, conversaciones: 0 });
  const [ultimasConversaciones, setUltimasConversaciones] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [pedidosRes, notifRes, convRes] = await Promise.all([
          api.get('/pedidos/asignados').catch(() => ({ data: [] })),
          api.get('/notificaciones/no-leidas').catch(() => ({ data: [] })),
          api.get('/chat/conversaciones').catch(() => ({ data: [] })),
        ]);

        const pedidos = Array.isArray(pedidosRes.data) ? pedidosRes.data : [];
        const noLeidas = Array.isArray(notifRes.data) ? notifRes.data : [];
        const conversaciones = Array.isArray(convRes.data) ? convRes.data : [];

        setStats({ pedidos: pedidos.length, noLeidas: noLeidas.length, conversaciones: conversaciones.length });
        setUltimasConversaciones(conversaciones.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const Card = ({ icon, title, value, subtitle }) => (
    <div className="p-6 ui-card">
      <div className="flex items-center gap-4">
        <div className="ui-icon-badge">{icon}</div>
        <div>
          <p className="text-sm ui-text">{title}</p>
          <p className="text-2xl font-bold ui-title">{value}</p>
        </div>
      </div>
      {subtitle && <p className="mt-3 text-sm ui-text">{subtitle}</p>}
    </div>
  );

  const renderUser = (conv, currentUserId) => {
    const other = (conv.participantes || []).find((p) => p.id !== currentUserId);
    return other?.nombre || 'Usuario';
  };

  return (
    <div>
      <h2 className="ui-title text-2xl mb-4">Panel del Empleado</h2>
      <p className="ui-subtitle mb-6">Resumen rápido de pedidos asignados, notificaciones y conversaciones.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card icon={<Inbox className="w-6 h-6" />} title="Pedidos asignados" value={stats.pedidos} />
        <Card icon={<Bell className="w-6 h-6" />} title="Notificaciones no leídas" value={stats.noLeidas} />
        <Card icon={<MessagesSquare className="w-6 h-6" />} title="Conversaciones" value={stats.conversaciones} />
      </div>

      <div className="ui-card p-6">
        <h3 className="text-lg font-semibold ui-title mb-4">Últimas conversaciones</h3>
        {loading ? (
          <p className="text-slate-400">Cargando...</p>
        ) : ultimasConversaciones.length === 0 ? (
          <p className="text-slate-400">Sin conversaciones recientes</p>
        ) : (
          <div className="divide-y divide-slate-700">
            {ultimasConversaciones.map((conv) => (
              <div key={conv.id} className="py-3 flex items-center justify-between hover:bg-slate-700/30 px-3 rounded-lg transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{renderUser(conv)}</p>
                  <p className="text-xs text-slate-400 truncate">{conv.ultimoMensaje || 'Sin mensajes'}</p>
                </div>
                <span className="text-xs text-slate-500">{new Date(conv.actualizadoEn || conv.updatedAt).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Tasks = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Tareas</h2>
    <p className="text-gray-600">Lista de tareas asignadas al empleado.</p>
  </div>
);

// EditProfile y Notifications ahora se importan como secciones reales

const EmpleadoDashboard = () => {
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
    <div className="flex h-screen bg-slate-900 role-empleado">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-amber-400">Sellos-G</h1>
            <p className="text-sm text-slate-400 mt-1">Empleado</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/empleado/dashboard')}
                className={`w-full flex items-center ui-nav-btn mb-1 ${
                  location.pathname === '/empleado/dashboard' ? 'active' : ''
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3 " />
                Panel Principal
              </button>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Operaciones</p>
                <button
                  onClick={() => navigate('/empleado/dashboard/tareas')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/empleado/dashboard/tareas' ? 'active' : ''
                  }`}
                >
                  <Clipboard className="w-5 h-5 mr-3 " />
                  Tareas
                </button>
                <button
                  onClick={() => navigate('/empleado/dashboard/pedidos')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/empleado/dashboard/pedidos' ? 'active' : ''
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Pedidos Asignados
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Perfil</p>
                <button
                  onClick={() => navigate('/empleado/dashboard/editar-perfil')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/empleado/dashboard/editar-perfil' ? 'active' : ''
                  }`}
                >
                  <User className="w-5 h-5 mr-3 " />
                  Editar Perfil
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">Comunicación</p>
                <button
                  onClick={() => navigate('/empleado/dashboard/notificaciones')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/empleado/dashboard/notificaciones' ? 'active' : ''
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
                  onClick={() => navigate('/empleado/dashboard/chat')}
                  className={`w-full flex items-center ui-nav-btn mb-1 ${
                    location.pathname === '/empleado/dashboard/chat' ? 'active' : ''
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-3 " />
                  Chat
                </button>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{user?.nombre || 'Empleado'}</p>
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

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/tareas" element={<Tasks />} />
              <Route path="/pedidos" element={<AssignedOrders />} />
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

export default EmpleadoDashboard;
