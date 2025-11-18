// src/services/userService.js
import api from './api';

const userService = {
  // Obtener todos los usuarios (empleados y clientes)
  getUsers: async (rol = null) => {
    try {
      const url = rol ? `/usuarios?rol=${rol}` : '/usuarios';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuarios' };
    }
  },

  // Obtener un usuario por ID
  getUser: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el usuario' };
    }
  },

  // Crear un usuario (empleado o cliente)
  createUser: async (userData) => {
    try {
      const response = await api.post('/usuarios', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el usuario' };
    }
  },

  // Actualizar un usuario
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el usuario' };
    }
  },

  // Eliminar un usuario
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el usuario' };
    }
  },

  // Obtener empleados
  getEmpleados: async () => {
    try {
      const response = await api.get('/empleados');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener empleados' };
    }
  },

  // Obtener clientes
  getClientes: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener clientes' };
    }
  },
};

export default userService;

