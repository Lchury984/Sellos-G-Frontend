// src/services/chatService.js
import api from './api';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
let socket = null;

const chatService = {
  // Conectar al socket
  connect: (userId) => {
    if (!socket) {
      socket = io(API_URL, {
        auth: {
          token: localStorage.getItem('token'),
        },
      });
    }
    return socket;
  },

  // Desconectar del socket
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  // Obtener conversaciones
  getConversations: async () => {
    try {
      const response = await api.get('/chat/conversaciones');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener conversaciones' };
    }
  },

  // Obtener mensajes de una conversación
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/chat/conversaciones/${conversationId}/mensajes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener mensajes' };
    }
  },

  // Enviar mensaje (texto o media)
  sendMessage: async (conversationId, payload) => {
    try {
      const response = await api.post(`/chat/conversaciones/${conversationId}/mensajes`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al enviar mensaje' };
    }
  },

  // Subir adjunto (imagen/video)
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/chat/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Crear conversación
  createConversation: async (userId) => {
    try {
      const response = await api.post('/chat/conversaciones', { userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear conversación' };
    }
  },

  // Suscribirse a nuevos mensajes
  onNewMessage: (callback) => {
    if (socket) {
      socket.on('nuevo_mensaje', callback);
    }
  },

  // Desuscribirse de nuevos mensajes
  offNewMessage: (callback) => {
    if (socket) {
      socket.off('nuevo_mensaje', callback);
    }
  },

  // Suscribirse a notificaciones de mensajes
  onMessageNotification: (callback) => {
    if (socket) {
      socket.on('notificacion_mensaje', callback);
    }
  },

  // Desuscribirse de notificaciones
  offMessageNotification: (callback) => {
    if (socket) {
      socket.off('notificacion_mensaje', callback);
    }
  },

  // Emitir que el usuario está escribiendo
  emitTyping: (conversationId, isTyping) => {
    if (socket) {
      socket.emit('escribiendo', { conversationId, isTyping });
    }
  },

  // Suscribirse a eventos de escritura
  onTyping: (callback) => {
    if (socket) {
      socket.on('usuario_escribiendo', callback);
    }
  },
};

export default chatService;

