// src/pages/admin/sections/Orders.jsx
import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Edit, Trash2, X, Save, User } from 'lucide-react';
import orderService from '../../../services/orderService';
import userService from '../../../services/userService';
import productService from '../../../services/productService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    empleadoId: '',
    productos: [{ productoId: '', cantidad: 1 }],
    estado: 'pendiente',
    notas: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, empleadosData, productsData] = await Promise.all([
        orderService.getOrders(),
        userService.getEmpleados(),
        productService.getProducts(),
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.data || []);
      setEmpleados(Array.isArray(empleadosData) ? empleadosData : empleadosData.data || []);
      setProducts(Array.isArray(productsData) ? productsData : productsData.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al cargar datos' });
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

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, { productoId: '', cantidad: 1 }],
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await orderService.updateOrder(editingOrder.id, formData);
        setMessage({ type: 'success', text: 'Pedido actualizado correctamente' });
      } else {
        await orderService.createOrder(formData);
        setMessage({ type: 'success', text: 'Pedido creado correctamente' });
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al guardar pedido' });
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      clienteId: order.clienteId || order.cliente?.id || '',
      empleadoId: order.empleadoId || order.empleado?.id || '',
      productos: order.productos || [{ productoId: '', cantidad: 1 }],
      estado: order.estado || 'pendiente',
      notas: order.notas || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        await orderService.deleteOrder(id);
        setMessage({ type: 'success', text: 'Pedido eliminado correctamente' });
        fetchData();
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Error al eliminar pedido' });
      }
    }
  };

  const handleAssign = async (orderId, empleadoId) => {
    try {
      await orderService.assignOrder(orderId, empleadoId);
      setMessage({ type: 'success', text: 'Pedido asignado correctamente' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al asignar pedido' });
    }
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      empleadoId: '',
      productos: [{ productoId: '', cantidad: 1 }],
      estado: 'pendiente',
      notas: '',
    });
    setEditingOrder(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Pedidos
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona y asigna pedidos a empleados
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Pedido
        </button>
      </div>

      {/* Mensajes */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.cliente?.nombre || order.clienteId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.empleado?.nombre || order.empleadoId || (
                    <select
                      onChange={(e) => handleAssign(order.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      defaultValue=""
                    >
                      <option value="">Asignar...</option>
                      {empleados.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      order.estado === 'completado'
                        ? 'bg-green-100 text-green-700'
                        : order.estado === 'en_proceso'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Pedido */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente ID
                  </label>
                  <input
                    type="text"
                    name="clienteId"
                    value={formData.clienteId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignar a Empleado
                  </label>
                  <select
                    name="empleadoId"
                    value={formData.empleadoId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Productos
                  </label>
                  {formData.productos.map((producto, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <select
                        value={producto.productoId}
                        onChange={(e) => handleProductChange(index, 'productoId', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Seleccione producto</option>
                        {products.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.nombre} - ${prod.precio}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={producto.cantidad}
                        onChange={(e) => handleProductChange(index, 'cantidad', parseInt(e.target.value))}
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {formData.productos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProduct}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Agregar Producto
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas
                  </label>
                  <textarea
                    name="notas"
                    value={formData.notas}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-5 h-5" />
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

