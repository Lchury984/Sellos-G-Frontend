// src/services/companyService.js
import api from './api';

const companyService = {
  // Obtener datos de la empresa
  getCompanyData: async () => {
    try {
      const response = await api.get('/empresa');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener datos de la empresa' };
    }
  },

  // Actualizar datos de la empresa
  updateCompanyData: async (data) => {
    try {
      const formData = new FormData();
      if (data.nombre) formData.append('nombre', data.nombre);
      if (data.descripcion) formData.append('descripcion', data.descripcion);
      if (data.telefono) formData.append('telefono', data.telefono);
      if (data.direccion) formData.append('direccion', data.direccion);
      if (data.email) formData.append('email', data.email);
      if (data.logo) formData.append('logo', data.logo);
      
      const response = await api.put('/empresa', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar datos de la empresa' };
    }
  },
};

export default companyService;

