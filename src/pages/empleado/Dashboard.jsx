import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

  const Card = ({ icon, title, value, subtitle, color = 'bg-blue-50 border-blue-200 text-blue-800' }) => (
    <div className={`p-6 bg-white rounded-xl shadow-sm border ${color}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-700">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {subtitle && <p className="mt-3 text-sm text-gray-600">{subtitle}</p>}
    </div>
  );

  const renderUser = (conv, currentUserId) => {
    const other = (conv.participantes || []).find((p) => p.id !== currentUserId);
    return other?.nombre || 'Usuario';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Panel del Empleado</h2>
      <p className="text-gray-600 mb-6">Resumen rápido de pedidos asignados, notificaciones y conversaciones.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card icon={<Inbox className="w-6 h-6" />} title="Pedidos asignados" value={stats.pedidos} />
        <Card icon={<Bell className="w-6 h-6" />} title="Notificaciones no leídas" value={stats.noLeidas} />
        <Card icon={<MessagesSquare className="w-6 h-6" />} title="Conversaciones" value={stats.conversaciones} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas conversaciones</h3>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : ultimasConversaciones.length === 0 ? (
          <p className="text-gray-500">Sin conversaciones recientes</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {ultimasConversaciones.map((conv) => (
              <div key={conv.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{renderUser(conv)}</p>
                  <p className="text-xs text-gray-500 truncate">{conv.ultimoMensaje || 'Sin mensajes'}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(conv.actualizadoEn || conv.updatedAt).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
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

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Sellos-G</h1>
            <p className="text-sm text-gray-500 mt-1">Empleado</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/empleado/dashboard')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/empleado/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Panel Principal
              </button>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Operaciones</p>
                <button
                  onClick={() => navigate('/empleado/dashboard/tareas')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/empleado/dashboard/tareas'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Clipboard className="w-5 h-5 mr-3" />
                  Tareas
                </button>
                <button
                  onClick={() => navigate('/empleado/dashboard/pedidos')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/empleado/dashboard/pedidos'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Pedidos Asignados
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Perfil</p>
                <button
                  onClick={() => navigate('/empleado/dashboard/editar-perfil')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/empleado/dashboard/editar-perfil'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Editar Perfil
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Comunicación</p>
                <button
                  onClick={() => navigate('/empleado/dashboard/notificaciones')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/empleado/dashboard/notificaciones'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notificaciones
                </button>
                <button
                  onClick={() => navigate('/empleado/dashboard/chat')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/empleado/dashboard/chat'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Chat
                </button>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre || 'Empleado'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/tareas" element={<Tasks />} />
              <Route path="/pedidos" element={<AssignedOrders />} />
              <Route path="/editar-perfil" element={<EditProfile />} />
              <Route path="/notificaciones" element={<Notifications />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpleadoDashboard;
