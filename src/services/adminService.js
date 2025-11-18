// src/services/adminService.js
import api from './api';

const adminService = {
  // Actualizar perfil del administrador
  updateProfile: async (adminData) => {
    try {
      const response = await api.put('/admins/profile', adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el perfil' };
    }
  },

  // Cambiar contraseña del administrador
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.patch('/admins/password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al cambiar la contraseña' };
    }
  },
};

export default adminService;

