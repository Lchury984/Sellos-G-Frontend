// src/services/orderService.js
import api from './api';

const orderService = {
  // Obtener todos los pedidos
  getOrders: async () => {
    try {
      const response = await api.get('/pedidos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener pedidos' };
    }
  },

  // Obtener un pedido por ID
  getOrder: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el pedido' };
    }
  },

  // Crear un pedido
  createOrder: async (orderData) => {
    try {
      // Si orderData es FormData, usar multipart/form-data
      const headers = orderData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };
      
      const response = await api.post('/pedidos', orderData, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el pedido' };
    }
  },

  // Actualizar un pedido
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/pedidos/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el pedido' };
    }
  },

  // Asignar pedido a empleado
  assignOrder: async (orderId, empleadoId) => {
    try {
      const response = await api.patch(`/pedidos/${orderId}/asignar`, { empleadoId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al asignar el pedido' };
    }
  },

  // Eliminar un pedido
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el pedido' };
    }
  },
};

export default orderService;

