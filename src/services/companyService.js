// src/services/companyService.js
import api from './api';

const companyService = {
  // Obtener configuración de la empresa (público)
  getSettings: async () => {
    try {
      const response = await api.get('/company/configuracion');
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) console.warn('Error obteniendo configuración:', error);
      // Retornar valores por defecto si falla
      return {
        nombre: 'Sellos-G',
        descripcion: 'Especialistas en la creación de sellos únicos y materiales publicitarios de alta calidad.',
        email: 'info@sellos-g.com',
        telefono: '+503 0000-0000',
        direccion: 'San Salvador, El Salvador',
        logoUrl: '',
        tagline: 'Sellos y Publicidad desde 2015'
      };
    }
  },

  // Actualizar configuración (solo admin)
  updateSettings: async (data) => {
    try {
      const response = await api.put('/company/configuracion', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar configuración' };
    }
  },

  // Métodos legacy (mantener compatibilidad)
  getCompanyData: async () => {
    return companyService.getSettings();
  },

  updateCompanyData: async (data) => {
    return companyService.updateSettings(data);
  }
};

export default companyService;

