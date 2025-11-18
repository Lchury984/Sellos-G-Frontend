// src/pages/cliente/Dashboard.jsx
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
import CreateOrder from './sections/CreateOrder';
import OrderTracking from './sections/OrderTracking';
import EditProfile from './sections/EditProfile';
import Notifications from './sections/Notifications';
import Chat from './sections/Chat';

const ClienteDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Sellos-G</h1>
            <p className="text-sm text-gray-500 mt-1">Cliente</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/cliente/dashboard')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/cliente/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Panel Principal
              </button>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">
                  Gestión de Pedidos
                </p>
                <button
                  onClick={() => navigate('/cliente/dashboard/catalogo')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/cliente/dashboard/catalogo'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Catálogo
                </button>
                <button
                  onClick={() => navigate('/cliente/dashboard/realizar-pedido')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/cliente/dashboard/realizar-pedido'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5 mr-3" />
                  Realizar Pedido
                </button>
                <button
                  onClick={() => navigate('/cliente/dashboard/seguimiento')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/cliente/dashboard/seguimiento'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="w-5 h-5 mr-3" />
                  Seguimiento
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Perfil</p>
                <button
                  onClick={() => navigate('/cliente/dashboard/editar-perfil')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/cliente/dashboard/editar-perfil'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Editar Perfil
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">
                  Comunicación
                </p>
                <button
                  onClick={() => navigate('/cliente/dashboard/notificaciones')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/cliente/dashboard/notificaciones'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notificaciones
                </button>
                <button
                  onClick={() => navigate('/cliente/dashboard/chat')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/cliente/dashboard/chat'
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

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nombre || 'Cliente'}
                </p>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/realizar-pedido" element={<CreateOrder />} />
              <Route path="/seguimiento" element={<OrderTracking />} />
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

export default ClienteDashboard;
