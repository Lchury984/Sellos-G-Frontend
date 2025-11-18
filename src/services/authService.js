// src/services/authService.js
import axios from 'axios';
import { authService as mockService } from './authService.mock';

// ✅ Configura la URL base de tu API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor para manejar expiración o errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authServiceImpl = {
  // ✅ Login corregido y robusto
  // Login corregido - acepta admin/user y asegura que exista rol
  login: async (email, password, rol) => {
    try {
      // Determinar endpoint según el rol
      let endpoint = "";
      if (rol === "administrador") {
        endpoint = "/admins/login";
      } else if (rol === "cliente") {
        endpoint = "/clientes/login";
      } else if (rol === "empleado") {
        endpoint = "/empleados/login";
      } else {
        throw { message: "Debe seleccionar un tipo de usuario válido" };
      }

      // Realizar la petición
      const response = await api.post(endpoint, { email, password });
      const data = response.data;
      const token = data.token;
      let userData = data.user || data.admin || data.cliente || data.empleado;

      // Asegurar que tenga un rol
      if (userData && !userData.rol) {
        userData = { ...userData, rol };
      }

      // Guardar en localStorage
      if (token) localStorage.setItem("token", token);
      if (userData) localStorage.setItem("user", JSON.stringify(userData));

      return { token, user: userData };
    } catch (error) {
      console.error("Error en login:", error);
      throw error.response?.data || { message: "Error al iniciar sesión" };
    }
  },



  // ✅ Logout
  logout: async () => {
    try {
      // Si tu backend no tiene /auth/logout, esto no es obligatorio
      await api.post('/auth/logout').catch(() => { });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // ✅ Recuperación de contraseña
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al solicitar recuperación' };
    }
  },

  // ✅ Restablecer contraseña
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al restablecer contraseña' };
    }
  },

  // ✅ Actualizar perfil
  updateProfile: async (userId, userData) => {
    try {
      // Si userData es FormData, usar multipart/form-data
      const headers = userData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };
      
      const response = await api.put(`/auth/profile`, userData, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar perfil' };
    }
  },

  // ✅ Actualizar contraseña
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.patch('/auth/password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar contraseña' };
    }
  },

  // ✅ Verificar token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al verificar token' };
    }
  },

  // ✅ Registro de cliente
  register: async (userData) => {
    try {
      // El registro siempre es para clientes
      const response = await api.post('/clientes/register', {
        nombre: userData.nombre,
        edad: userData.edad,
        email: userData.email,
        password: userData.password,
        rol: 'cliente', // Siempre se registra como cliente
      });
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  },

  // ✅ Verificar email (opcional - si el backend requiere verificación con token)
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/clientes/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error("Error en verificación de email:", error);
      throw error.response?.data || { message: 'Error al verificar email' };
    }
  },
};

// 🔍 Debugging temporal
console.log('API URL:', API_URL);
console.log('Mock mode:', import.meta.env.VITE_USE_MOCK);

const mockMode = import.meta.env.VITE_USE_MOCK;
export const authService = mockMode === 'true' ? mockService : authServiceImpl;

export default api;
