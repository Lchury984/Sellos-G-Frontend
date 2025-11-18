// src/services/productService.js
import api from './api';

const productService = {
  // Obtener todos los productos
  getProducts: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener productos' };
    }
  },

  // Obtener un producto por ID
  getProduct: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener el producto' };
    }
  },

  // Crear un producto
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      formData.append('nombre', productData.nombre);
      formData.append('precio', productData.precio);
      formData.append('precioBase', productData.precioBase || productData.precio);
      formData.append('categoriaId', productData.categoriaId);
      formData.append('estado', productData.estado || 'disponible');
      formData.append('descripcion', productData.descripcion || '');
      
      if (productData.imagen) {
        formData.append('imagen', productData.imagen);
      }

      // Promociones
      if (productData.descuento) {
        formData.append('descuento', productData.descuento);
      }
      if (productData.fechaInicioPromocion) {
        formData.append('fechaInicioPromocion', productData.fechaInicioPromocion);
      }
      if (productData.fechaFinPromocion) {
        formData.append('fechaFinPromocion', productData.fechaFinPromocion);
      }

      const response = await api.post('/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear el producto' };
    }
  },

  // Actualizar un producto
  updateProduct: async (id, productData) => {
    try {
      const formData = new FormData();
      if (productData.nombre) formData.append('nombre', productData.nombre);
      if (productData.precio !== undefined) formData.append('precio', productData.precio);
      if (productData.precioBase !== undefined) formData.append('precioBase', productData.precioBase);
      if (productData.categoriaId) formData.append('categoriaId', productData.categoriaId);
      if (productData.estado) formData.append('estado', productData.estado);
      if (productData.descripcion) formData.append('descripcion', productData.descripcion);
      
      if (productData.imagen) {
        formData.append('imagen', productData.imagen);
      }

      // Promociones
      if (productData.descuento !== undefined) {
        formData.append('descuento', productData.descuento);
      }
      if (productData.fechaInicioPromocion) {
        formData.append('fechaInicioPromocion', productData.fechaInicioPromocion);
      }
      if (productData.fechaFinPromocion) {
        formData.append('fechaFinPromocion', productData.fechaFinPromocion);
      }

      const response = await api.put(`/productos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar el producto' };
    }
  },

  // Eliminar un producto
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar el producto' };
    }
  },
};

export default productService;

