import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const Orders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    empleadoAsignado: '',
    productos: [{ producto: '', cantidad: 1 }],
    estado: 'pendiente',
    notaEmpleado: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    console.log('Estado actualizado - Clientes:', clientes.length, 'Empleados:', empleados.length, 'Productos:', productos.length);
  }, [clientes, empleados, productos]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pedidosRes, clientesRes, empleadosRes, productosRes] = await Promise.all([
        axios.get(`${API_BASE}/pedidos`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/empleados`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/productos`),
      ]);

      console.log('Clientes recibidos:', clientesRes.data);
      console.log('Empleados recibidos:', empleadosRes.data);
      console.log('Productos recibidos:', productosRes.data);

      setPedidos(pedidosRes.data || []);
      setClientes(clientesRes.data || []);
      setEmpleados(empleadosRes.data || []);
      setProductos(productosRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      console.error('Error details:', error.response?.data);
      setMessage({ type: 'error', text: 'Error al cargar datos: ' + (error.response?.data?.msg || error.message) });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const newProductos = [...formData.productos];
    newProductos[index][field] = value;
    setFormData(prev => ({ ...prev, productos: newProductos }));
  };

  const agregarProducto = () => {
    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, { producto: '', cantidad: 1 }]
    }));
  };

  const eliminarProducto = (index) => {
    if (formData.productos.length > 1) {
      const newProductos = formData.productos.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, productos: newProductos }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        cliente: formData.cliente,
        empleadoAsignado: formData.empleadoAsignado || null,
        productos: formData.productos.map(p => ({
          producto: p.producto,
          cantidad: parseInt(p.cantidad)
        })),
        notaEmpleado: formData.notaEmpleado
      };

      if (editingPedido) {
        await axios.put(`${API_BASE}/pedidos/${editingPedido._id}`, 
          { ...payload, estado: formData.estado },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage({ type: 'success', text: 'Pedido actualizado correctamente' });
      } else {
        await axios.post(`${API_BASE}/pedidos`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Pedido creado correctamente' });
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Error al guardar pedido' });
    }
  };

  const handleEdit = (pedido) => {
    setEditingPedido(pedido);
    setFormData({
      cliente: pedido.cliente.id || pedido.cliente._id,
      empleadoAsignado: pedido.empleadoAsignado?.id || pedido.empleadoAsignado?._id || '',
      productos: pedido.productos.map(p => ({
        producto: p.producto.id || p.producto._id,
        cantidad: p.cantidad
      })),
      estado: pedido.estado,
      notaEmpleado: pedido.notaEmpleado || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        await axios.delete(`${API_BASE}/pedidos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Pedido eliminado correctamente' });
        fetchData();
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.msg || 'Error al eliminar' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      empleadoAsignado: '',
      productos: [{ producto: '', cantidad: 1 }],
      estado: 'pendiente',
      notaEmpleado: '',
    });
    setEditingPedido(null);
  };

  const getEstadoBadge = (estado) => {
    const colores = {
      'pendiente': 'bg-yellow-100 text-yellow-700',
      'en proceso': 'bg-blue-100 text-blue-700',
      'completado': 'bg-green-100 text-green-700',
      'cancelado': 'bg-red-100 text-red-700'
    };
    return colores[estado] || 'bg-gray-100 text-gray-700';
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
          <p className="mt-1 text-sm text-gray-600">Administra los pedidos de los clientes</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Pedido
        </button>
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado Asignado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    No hay pedidos registrados
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{pedido.cliente?.nombre}</div>
                      <div className="text-sm text-gray-500">{pedido.cliente?.correo}</div>
                    </td>
                    <td className="px-6 py-4">
                      {pedido.empleadoAsignado ? (
                        <div className="text-sm text-gray-900">
                          {pedido.empleadoAsignado.nombre} {pedido.empleadoAsignado.apellido}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {pedido.productos.length} producto{pedido.productos.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">${pedido.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getEstadoBadge(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(pedido.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(pedido)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pedido._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <select
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id || cliente._id} value={cliente.id || cliente._id}>
                      {cliente.nombre} - {cliente.correo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignar Empleado
                </label>
                <select
                  name="empleadoAsignado"
                  value={formData.empleadoAsignado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin asignar</option>
                  {empleados.map((emp) => (
                    <option key={emp.id || emp._id} value={emp.id || emp._id}>
                      {emp.nombre} {emp.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Productos *
                  </label>
                  <button
                    type="button"
                    onClick={agregarProducto}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Producto
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.productos.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        value={item.producto}
                        onChange={(e) => handleProductChange(index, 'producto', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Seleccione producto</option>
                        {productos.map((prod) => (
                          <option key={prod.id || prod._id} value={prod.id || prod._id}>
                            {prod.nombre} - ${prod.precioActual?.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Cant."
                        required
                      />
                      {formData.productos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarProducto(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {editingPedido && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota para el empleado (Opcional)
                </label>
                <textarea
                  name="notaEmpleado"
                  value={formData.notaEmpleado}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instrucciones especiales para el empleado..."
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Save className="w-5 h-5" />
                  Guardar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

