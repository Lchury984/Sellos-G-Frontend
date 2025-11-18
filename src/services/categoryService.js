// src/services/categoryService.js
import api from './api';

const categoryService = {
  // Obtener todas las categorías
  getCategories: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener categorías' };
    }
  },

  // Obtener una categoría por ID
  getCategory: async (id) => {
    try {
      const response = await api.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener la categoría' };
    }
  },

  // Crear una categoría
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categorias', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear la categoría' };
    }
  },

  // Actualizar una categoría
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categorias/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar la categoría' };
    }
  },

  // Eliminar una categoría
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar la categoría' };
    }
  },
};

export default categoryService;

