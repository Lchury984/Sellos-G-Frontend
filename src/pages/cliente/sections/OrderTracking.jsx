// src/pages/cliente/sections/OrderTracking.jsx
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, Loader2, FileText } from 'lucide-react';
import orderService from '../../../services/orderService';
import { useAuth } from '../../../context/AuthContext';

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      const ordersData = Array.isArray(response) ? response : response.data || [];
      
      // Filtrar solo los pedidos del cliente actual
      const clientOrders = ordersData.filter(
        (order) => order.clienteId === user?.id || order.cliente?.id === user?.id
      );
      
      // Ordenar por fecha más reciente
      clientOrders.sort((a, b) => {
        const dateA = new Date(a.fecha || a.createdAt || 0);
        const dateB = new Date(b.fecha || b.createdAt || 0);
        return dateB - dateA;
      });

      setOrders(clientOrders);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'finalizado':
      case 'completado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'en_proceso':
      case 'procesando':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (estado) => {
    switch (estado) {
      case 'finalizado':
      case 'completado':
        return 'Finalizado';
      case 'en_proceso':
      case 'procesando':
        return 'En Proceso';
      case 'pendiente':
        return 'Pendiente';
      default:
        return estado || 'Desconocido';
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'finalizado':
      case 'completado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en_proceso':
      case 'procesando':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Pedidos</h2>
        <p className="mt-1 text-sm text-gray-600">
          Revisa el estado de tus pedidos en tiempo real
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-500">Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No tienes pedidos registrados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {getStatusIcon(order.estado)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{order.id || order.numeroPedido || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.tipo || 'Tipo no especificado'}
                    </p>
                    {order.clasificacion && (
                      <p className="text-xs text-gray-400 mt-1">
                        Clasificación: {order.clasificacion}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    order.estado
                  )}`}
                >
                  {getStatusLabel(order.estado)}
                </div>
              </div>

              {order.descripcion && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700">{order.descripcion}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(order.fecha || order.createdAt)}</span>
                </div>
                {order.archivos && order.archivos.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>{order.archivos.length} archivo(s)</span>
                  </div>
                )}
              </div>

              {/* Información adicional si está asignado */}
              {order.empleado && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Asignado a:</span>{' '}
                    {order.empleado.nombre || order.empleado}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default OrderTracking;

