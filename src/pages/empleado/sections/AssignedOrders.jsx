import { useState, useEffect } from 'react';
import { ClipboardList, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const AssignedOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/pedidos/asignados`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(response.data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setMessage({ type: 'error', text: 'Error al cargar pedidos asignados' });
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    try {
      await axios.patch(
        `${API_BASE}/pedidos/${pedidoId}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: 'Estado actualizado correctamente' });
      fetchPedidos();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Error al actualizar estado' });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Pedidos Asignados</h2>
        <p className="mt-1 text-sm text-gray-600">Gestiona los pedidos que te han sido asignados</p>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {pedidos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos asignados</h3>
          <p className="text-gray-500">Los pedidos que te asigne el administrador aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                {/* Header del pedido */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{pedido._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-lg border ${getEstadoBadge(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </div>

                {/* Información del cliente */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cliente</h4>
                  <div className="text-sm text-gray-900">
                    <p className="font-semibold">{pedido.cliente?.nombre}</p>
                    <p className="text-gray-600">{pedido.cliente?.correo}</p>
                    {pedido.cliente?.telefono && (
                      <p className="text-gray-600">{pedido.cliente.telefono}</p>
                    )}
                  </div>
                </div>

                {/* Productos */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Productos</h4>
                  <div className="space-y-2">
                    {pedido.productos.map((item, idx) => (
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

                {/* Nota del administrador */}
                {pedido.notaEmpleado && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Nota del administrador</h4>
                        <p className="text-sm text-blue-700">{pedido.notaEmpleado}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="mb-4 p-4 bg-gray-900 rounded-lg text-white flex justify-between items-center">
                  <span className="font-semibold">Total del Pedido</span>
                  <span className="text-2xl font-bold">${pedido.total.toFixed(2)}</span>
                </div>

                {/* Control de estado */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actualizar Estado del Pedido
                  </label>
                  <select
                    value={pedido.estado}
                    onChange={(e) => handleEstadoChange(pedido._id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedOrders;
