// src/pages/admin/sections/DashboardHome.jsx
import { useState, useEffect } from 'react';
import { Users, ShoppingCart, Package, FileText } from 'lucide-react';
import userService from '../../../services/userService';
import orderService from '../../../services/orderService';
import productService from '../../../services/productService';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    clientes: 0,
    pedidos: 0,
    productos: 0,
    reportes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientes, pedidos, productos] = await Promise.all([
          userService.getClientes().catch(() => null),
          orderService.getOrders().catch(() => null),
          productService.getProducts().catch(() => null),
        ]);

        // Función helper para obtener el length de forma segura
        const getLength = (response) => {
          if (!response) return 0;
          if (Array.isArray(response)) return response.length;
          if (response.data && Array.isArray(response.data)) return response.data.length;
          if (typeof response.length === 'number') return response.length;
          return 0;
        };

        setStats({
          clientes: getLength(clientes),
          pedidos: getLength(pedidos),
          productos: getLength(productos),
          reportes: 0,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        // Asegurar que siempre se establezcan valores por defecto
        setStats({
          clientes: 0,
          pedidos: 0,
          productos: 0,
          reportes: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Panel Principal</h2>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido al panel de administración de Sellos-G
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.clientes}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Clientes</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.pedidos}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pedidos Activos</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.productos}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Productos</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.reportes}
            </span>
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
              <p className="text-sm font-medium text-gray-900">Sistema iniciado</p>
              <p className="text-sm text-gray-500">Panel de administración activo</p>
              <p className="text-xs text-gray-400 mt-1">Ahora</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;

