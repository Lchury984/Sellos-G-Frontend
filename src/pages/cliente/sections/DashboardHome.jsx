// src/pages/cliente/sections/DashboardHome.jsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Bell } from 'lucide-react';
import orderService from '../../../services/orderService';
import notificationService from '../../../services/notificationService';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    pedidosEnCurso: 0,
    ultimoPedido: null,
    notificaciones: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [pedidos, notificaciones] = await Promise.all([
        orderService.getOrders().catch(() => ({ data: [] })),
        notificationService.getUnreadNotifications().catch(() => ({ data: [] })),
      ]);

      const pedidosData = Array.isArray(pedidos) ? pedidos : pedidos.data || [];
      const pedidosEnCurso = pedidosData.filter(
        (p) => p.estado === 'en_proceso' || p.estado === 'pendiente'
      );
      const ultimoPedido = pedidosData.length > 0 ? pedidosData[0] : null;
      const notificacionesData = Array.isArray(notificaciones)
        ? notificaciones
        : notificaciones.data || [];

      setStats({
        pedidosEnCurso: pedidosEnCurso.length,
        ultimoPedido: ultimoPedido?.id || null,
        notificaciones: notificacionesData.length,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Panel Principal</h2>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido al panel de cliente de Sellos-G
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.pedidosEnCurso}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pedidos en Curso</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.ultimoPedido ? `#${stats.ultimoPedido}` : 'N/A'}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Último Pedido</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {loading ? '...' : stats.notificaciones}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Notificaciones</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">Ver Catálogo</h4>
            <p className="text-sm text-gray-600">
              Explora nuestros productos disponibles y realiza pedidos
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">Seguimiento de Pedidos</h4>
            <p className="text-sm text-gray-600">
              Revisa el estado de tus pedidos en tiempo real
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;

