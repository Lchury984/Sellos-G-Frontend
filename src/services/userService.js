// src/services/userService.js
import api from './api';

const userService = {

  // Obtener empleados
  getEmpleados: async () => {
    try {
      // Endpoint administrado por el grupo admin
      const response = await api.get('/admins/empleados');
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

  // Obtener usuarios por rol
  getUsers: async (rol = null) => {
    try {
      if (rol === 'empleado') {
        return await userService.getEmpleados();
      } else if (rol === 'cliente') {
        return await userService.getClientes();
      } else {
        const [empleados, clientes] = await Promise.all([
          userService.getEmpleados().catch(() => []),
          userService.getClientes().catch(() => []),
        ]);
        return [...(Array.isArray(empleados) ? empleados : []), ...(Array.isArray(clientes) ? clientes : [])];
      }
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuarios' };
    }
  },

  // Crear usuario (empleado o cliente)
  createUser: async (userData) => {
    try {
      const password = userData.password || Math.random().toString(36).slice(-8);

      if (userData.rol === 'empleado') {
        const response = await api.post('/admins/empleados', {
          nombre: userData.nombre,
          correo: userData.correo || userData.email,
          password,
          edad: userData.edad,
        });
        return response.data;
      } else {
        const response = await api.post('/clientes', {
          nombre: userData.nombre,
          correo: userData.correo || userData.email,
          password,
          edad: userData.edad,
        });
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el usuario' };
    }
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    try {
      const endpoint = userData.rol === 'empleado'
        ? `/admins/empleados/${id}`
        : `/clientes/${id}`;

      const response = await api.put(endpoint, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el usuario' };
    }
  },

  // Eliminar usuario
  deleteUser: async (id, rol) => {
    try {
      const endpoint = rol === 'empleado'
        ? `/admins/empleados/${id}`
        : `/clientes/${id}`;
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el usuario' };
    }
  },

};

export default userService;