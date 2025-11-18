// src/services/notificationService.js
import api from './api';

const notificationService = {
  // Obtener todas las notificaciones
  getNotifications: async () => {
    try {
      const response = await api.get('/notificaciones');
      return response.data;
    } catch (error) {
      // Si es 404, retornar array vacío en lugar de lanzar error
      if (error.response?.status === 404) {
        console.warn('Endpoint de notificaciones no disponible en el backend');
        return [];
      }
      throw error.response?.data || { message: 'Error al obtener notificaciones' };
    }
  },

  // Obtener notificaciones no leídas
  // Si el endpoint no existe, retorna null para que el componente use fallback
  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/notificaciones/no-leidas');
      return response.data;
    } catch (error) {
      // Si es 404, retornar null para indicar que el endpoint no existe
      if (error.response?.status === 404) {
        console.warn('Endpoint /notificaciones/no-leidas no disponible en el backend');
        return null; // El componente usará fallback
      }
      // Para otros errores, también retornar null para evitar que rompa la UI
      console.warn('Error al obtener notificaciones no leídas:', error);
      return null;
    }
  },

  // Marcar notificación como leída
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notificaciones/${id}/leer`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al marcar notificación como leída' };
    }
  },

  // Marcar todas como leídas
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notificaciones/leer-todas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al marcar todas como leídas' };
    }
  },

  // Eliminar notificación
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notificaciones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar notificación' };
    }
  },
};

export default notificationService;

