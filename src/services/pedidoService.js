// src/services/pedidoService.js
import api from './api';

const pedidoService = {
  // Obtener mis pedidos (cliente)
  obtenerMisPedidos: async () => {
    const response = await api.get('/pedidos/mis-pedidos');
    return response.data;
  },

  // Crear pedido personalizado (cliente)
  crearPedidoPersonalizado: async (formData) => {
    const response = await api.post('/pedidos/personalizado', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin - Obtener todos los pedidos
  obtenerTodosPedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  // Admin - Crear pedido
  crearPedido: async (pedidoData) => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  // Admin - Actualizar pedido
  actualizarPedido: async (id, pedidoData) => {
    const response = await api.put(`/pedidos/${id}`, pedidoData);
    return response.data;
  },

  // Admin - Eliminar pedido
  eliminarPedido: async (id) => {
    const response = await api.delete(`/pedidos/${id}`);
    return response.data;
  },

  // Empleado - Obtener pedidos asignados
  obtenerPedidosAsignados: async () => {
    const response = await api.get('/pedidos/asignados');
    return response.data;
  },

  // Empleado - Actualizar estado de pedido
  actualizarEstadoPedido: async (id, estadoData) => {
    const response = await api.patch(`/pedidos/${id}/estado`, estadoData);
    return response.data;
  },
};

export default pedidoService;
