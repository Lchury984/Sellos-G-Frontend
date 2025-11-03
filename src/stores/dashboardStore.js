import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  // Estado inicial
  statistics: {
    totalUsers: 0,
    activeUsers: 0,
    pendingRequests: 0
  },
  loading: false,
  error: null,

  // Acciones
  setStatistics: (stats) => set({ statistics: stats }),
  setLoading: (status) => set({ loading: status }),
  setError: (error) => set({ error }),
  
  // Ejemplo de una acción asíncrona
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      // Aquí irá tu lógica para obtener datos del backend
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      set({ statistics: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Limpiar el estado
  reset: () => set({
    statistics: {
      totalUsers: 0,
      activeUsers: 0,
      pendingRequests: 0
    },
    loading: false,
    error: null
  })
}));

export default useDashboardStore;