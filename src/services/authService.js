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
  // ✅ Login UNIFICADO: Solo requiere correo y password
  login: async (correo, password) => { // Ya no acepta 'rol'
    try {
      // 1. Llamar al endpoint unificado
      // Usamos el endpoint '/auth/login' que está definido en authRoutes.js
      const endpoint = "/auth/login";

      // 2. Realizar la petición
      const response = await api.post(endpoint, { correo, password });
      const data = response.data; // Esperamos { msg, token, rol, user }

      // 3. Guardar token y rol en localStorage (se refuerza en AuthContext.login)
      if (data.token) localStorage.setItem("token", data.token);
      if (data.rol) localStorage.setItem("user_role", data.rol);

      // 4. Retornar la respuesta completa para que el caller use user/rol/token
      return data;
    } catch (error) {
      console.error("Error en login:", error);
      // Mantener manejo de errores
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
  forgotPassword: async (correo) => {
    try {
      const response = await api.post('/auth/forgot-password', { correo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al solicitar recuperación' };
    }
  },

  // ✅ Restablecer contraseña
  resetPassword: async (token, nuevaContraseña) => {
    try {
      const response = await api.patch(`/auth/reset-password/${token}`, {
        nuevaContraseña,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al restablecer contraseña' };
    }
  },



  // ✅ Actualizar perfil (cliente/empleado/admin según rol actual)
  updateProfile: async (userData) => {
    try {
      const isForm = userData instanceof FormData;
      const headers = isForm
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

      let endpoint = '/clientes/me';
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const rol = (storedUser.rol || storedUser.role || '').toLowerCase();
        if (rol === 'empleado') endpoint = '/empleados/me';
        if (rol === 'administrador' || rol === 'admin') endpoint = '/admins/me';
      } catch { /* ignore */ }

      const response = await api.patch(endpoint, userData, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar perfil' };
    }
  },

  // ✅ Actualizar contraseña (usa el endpoint protegido '/auth/actualizar')
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.patch('/auth/actualizar', { contraseñaActual: currentPassword, nuevaContraseña: newPassword });
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
  // ✅ Registro de cliente (envía correo correctamente)
  register: async (userData) => {
    try {
      const response = await api.post('/clientes/register', {
        nombre: userData.nombre,
        edad: userData.edad,
        correo: userData.correo,   // ⬅️ IMPORTANTE: backend recibe "email"
        password: userData.password,
        rol: 'cliente',
      });
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error.response?.data || { message: 'Error al registrar usuario' };
    }
  },

  // authService.js
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error("Error en verificación de correo:", error);
      throw error.response?.data || { message: "Token inválido o expirado" };
    }
  },



};

// 🔍 Debugging temporal
console.log('API URL:', API_URL);
console.log('Mock mode:', import.meta.env.VITE_USE_MOCK);

const mockMode = import.meta.env.VITE_USE_MOCK;
export const authService = mockMode === 'true' ? mockService : authServiceImpl;

export default api;
