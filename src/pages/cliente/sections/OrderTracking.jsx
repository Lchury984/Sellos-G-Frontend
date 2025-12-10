// src/pages/cliente/sections/OrderTracking.jsx
import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, AlertCircle, Loader2, Package, User, DollarSign } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const OrderTracking = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/pedidos/mis-pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(response.data || []);
    } catch (err) {
      setError('Error al cargar tus pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const colores = {
      'pendiente': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'en proceso': 'bg-blue-100 text-blue-700 border-blue-300',
      'completado': 'bg-green-100 text-green-700 border-green-300',
      'cancelado': 'bg-red-100 text-red-700 border-red-300'
    };
    return colores[estado] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'pendiente': <AlertCircle className="w-5 h-5 text-yellow-600" />,
      'en proceso': <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
      'completado': <CheckCircle className="w-5 h-5 text-green-600" />,
      'cancelado': <AlertCircle className="w-5 h-5 text-red-600" />
    };
    return iconos[estado] || <AlertCircle className="w-5 h-5" />;
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
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Pedidos</h2>
        <p className="mt-1 text-sm text-gray-600">
          Consulta el estado y detalles de tus pedidos
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos</h3>
          <p className="text-gray-500">Los pedidos que hagas aparecerán aquí para que puedas hacer seguimiento</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
              <div className="p-6">
                {/* Header del pedido */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{pedido._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(pedido.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(pedido.estado)}
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-lg border ${getEstadoBadge(pedido.estado)}`}>
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Empleado asignado - LECTURA SOLO */}
                {pedido.empleadoAsignado ? (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-medium text-gray-700">Asignado a</h4>
                    </div>
                    <div className="text-sm text-gray-900">
                      <p className="font-semibold">{pedido.empleadoAsignado?.nombre} {pedido.empleadoAsignado?.apellido}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-700">Asignado a</h4>
                    </div>
                    <p className="text-sm text-gray-500 italic">Sin asignar</p>
                  </div>
                )}

                {/* Productos */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Productos</h4>
                  <div className="space-y-2">
                    {pedido.productos?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.producto?.imagenUrl && (
                            <img
                              src={item.producto.imagenUrl}
                              alt={item.producto.nombre}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.producto?.nombre}</p>
                            <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">${item.precioUnitario.toFixed(2)} c/u</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nota */}
                {pedido.notaEmpleado && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Nota sobre tu pedido</h4>
                        <p className="text-sm text-blue-700">{pedido.notaEmpleado}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="p-4 bg-gray-900 rounded-lg text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold">Total del Pedido</span>
                  </div>
                  <span className="text-2xl font-bold">${pedido.total.toFixed(2)}</span>
                </div>

                {/* Timeline de estado */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex-1 text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${pedido.estado === 'pendiente' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-600">Pendiente</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                    <div className="flex-1 text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${pedido.estado === 'en proceso' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-600">En Proceso</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                    <div className="flex-1 text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${pedido.estado === 'completado' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-600">Completado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;

