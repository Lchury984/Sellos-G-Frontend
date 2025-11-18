// src/pages/admin/Dashboard.jsx
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Company Logo & Info */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Sellos-G</h1>
            <p className="text-sm text-gray-500 mt-1">Administrador</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/admin/dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Panel Principal
              </button>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Perfil y Empresa</p>
                <button
                  onClick={() => navigate('/admin/dashboard/empresa')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/empresa'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Building2 className="w-5 h-5 mr-3" />
                  Datos de Empresa
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/configuracion')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/configuracion'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Configuración
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Gestión</p>
                <button
                  onClick={() => navigate('/admin/dashboard/productos')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/productos'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5 mr-3" />
                  Productos
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/pedidos')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/pedidos'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ClipboardList className="w-5 h-5 mr-3" />
                  Pedidos
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/inventario')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/inventario'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Boxes className="w-5 h-5 mr-3" />
                  Inventario
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/usuarios')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/usuarios'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UserCog className="w-5 h-5 mr-3" />
                  Usuarios
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Reportes</p>
                <button
                  onClick={() => navigate('/admin/dashboard/estadisticas')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/estadisticas'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Estadísticas
                </button>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Comunicación</p>
                <button
                  onClick={() => navigate('/admin/dashboard/notificaciones')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/notificaciones'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notificaciones
                </button>
                <button
                  onClick={() => navigate('/admin/dashboard/chat')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === '/admin/dashboard/chat'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessagesSquare className="w-5 h-5 mr-3" />
                  Chat
                </button>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre}</p>
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
              <Route path="/empresa" element={<CompanyData />} />
              <Route path="/configuracion" element={<AdminSettings />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/pedidos" element={<Orders />} />
              <Route path="/inventario" element={<Inventory />} />
              <Route path="/usuarios" element={<UsersManagement />} />
              <Route path="/estadisticas" element={<Statistics />} />
              <Route path="/notificaciones" element={<Notifications />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};


export default AdminDashboard;