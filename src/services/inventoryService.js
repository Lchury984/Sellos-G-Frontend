// src/services/inventoryService.js
import api from './api';

const inventoryService = {
  // Obtener todos los materiales
  getMaterials: async () => {
    try {
      const response = await api.get('/inventario/materiales');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener materiales' };
    }
  },

  // Obtener un material por ID
  getMaterial: async (id) => {
    try {
      const response = await api.get(`/inventario/materiales/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el material' };
    }
  },

  // Crear un material
  createMaterial: async (materialData) => {
    try {
      const response = await api.post('/inventario/materiales', materialData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el material' };
    }
  },

  // Actualizar un material
  updateMaterial: async (id, materialData) => {
    try {
      const response = await api.put(`/inventario/materiales/${id}`, materialData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el material' };
    }
  },

  // Eliminar un material
  deleteMaterial: async (id) => {
    try {
      const response = await api.delete(`/inventario/materiales/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el material' };
    }
  },

  // Actualizar cantidad de material
  updateStock: async (id, cantidad) => {
    try {
      const response = await api.patch(`/inventario/materiales/${id}/stock`, { cantidad });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el stock' };
    }
  },

  // Obtener materiales con stock bajo
  getLowStockMaterials: async (threshold = 10) => {
    try {
      const response = await api.get(`/inventario/materiales/bajo-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener materiales con stock bajo' };
    }
  },
};

export default inventoryService;

