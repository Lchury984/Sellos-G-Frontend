import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Package,
  ClipboardList,
  Clock,
  MessageSquare,
  Bell,
  Settings,
  UserCog
} from 'lucide-react';

const EmpleadoDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Sellos-G</h1>
            <p className="text-sm text-gray-500 mt-1">Empleado</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Gestión</p>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <ClipboardList className="w-5 h-5 mr-3" />
                  Pedidos asignados
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Clock className="w-5 h-5 mr-3" />
                  Actualizar estado
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Package className="w-5 h-5 mr-3" />
                  Registrar avances
                </a>
              </div>

              <div className="mt-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Comunicación</p>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Chat Admin
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                  <Bell className="w-5 h-5 mr-3" />
                  Notificaciones
                </a>
              </div>
            </div>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nombre}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="ml-2 flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Panel Empleado</h1>
              <p className="text-sm text-gray-600">Pedidos asignados y gestión de avances</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-sm font-semibold text-gray-700">Pedidos en curso</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-sm font-semibold text-gray-700">Pendientes</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-sm font-semibold text-gray-700">Finalizados hoy</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos asignados</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Pedido #1234</p>
                    <p className="text-sm text-gray-500">Cliente: Juan Pérez — Estado: En proceso</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm">Ver</button>
                    <button className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm">Marcar finalizado</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
    
  );
};

export default EmpleadoDashboard;
