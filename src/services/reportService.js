// src/services/reportService.js
import api from './api';

const reportService = {
  // Generar reporte de ventas
  generateSalesReport: async (fechaInicio, fechaFin) => {
    try {
      const response = await api.get('/reportes/ventas', {
        params: { fechaInicio, fechaFin },
        responseType: 'blob', // Para archivos binarios
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al generar reporte de ventas' };
    }
  },

  // Generar reporte de inventario
  generateInventoryReport: async (fechaInicio, fechaFin) => {
    try {
      const response = await api.get('/reportes/inventario', {
        params: { fechaInicio, fechaFin },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al generar reporte de inventario' };
    }
  },

  // Obtener datos de ventas para exportación
  getSalesData: async (fechaInicio, fechaFin) => {
    try {
      const response = await api.get('/reportes/ventas/datos', {
        params: { fechaInicio, fechaFin },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener datos de ventas' };
    }
  },

  // Obtener datos de inventario para exportación
  getInventoryData: async (fechaInicio, fechaFin) => {
    try {
      const response = await api.get('/reportes/inventario/datos', {
        params: { fechaInicio, fechaFin },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener datos de inventario' };
    }
  },
};

export default reportService;

