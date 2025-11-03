// src/pages/admin/Dashboard.jsx
import Sidebar from '../../components/sidebar';
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

const AdminDashboard = () => { 
    
  const { user, logout } = useAuth();

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
              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Perfil y Empresa</p>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Building2 className="w-5 h-5 mr-3" />
                  Datos de Empresa
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Settings className="w-5 h-5 mr-3" />
                  Configuración
                </a>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Gestión</p>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Package className="w-5 h-5 mr-3" />
                  Productos
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <ClipboardList className="w-5 h-5 mr-3" />
                  Pedidos
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Boxes className="w-5 h-5 mr-3" />
                  Inventario
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <UserCog className="w-5 h-5 mr-3" />
                  Usuarios
                </a>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Reportes</p>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Estadísticas
                </a>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Comunicación</p>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Bell className="w-5 h-5 mr-3" />
                  Notificaciones
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <MessagesSquare className="w-5 h-5 mr-3" />
                  Chat
                </a>
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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Panel Principal</h2>
              <p className="mt-1 text-sm text-gray-600">
                Bienvenido {user?.nombre} al panel de administración de Sellos-G
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">125</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">Total Clientes</h3>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">48</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">Pedidos Activos</h3>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">87</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">Productos</h3>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">234</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600">Reportes</h3>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nuevo pedido recibido</p>
                    <p className="text-sm text-gray-500">Pedido #1234 - Cliente: Juan Pérez</p>
                    <p className="text-xs text-gray-400 mt-1">Hace 5 minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nuevo cliente registrado</p>
                    <p className="text-sm text-gray-500">María González se ha unido</p>
                    <p className="text-xs text-gray-400 mt-1">Hace 15 minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


export default AdminDashboard;