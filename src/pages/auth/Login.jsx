// src/pages/auth/Login.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Calendar } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    rol: '',
    nombre: '',
    edad: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  // ---------------------------
  //  🔹 MODO REGISTRO
  // ---------------------------
  if (isRegister) {

    if (!formData.correo || !formData.password || !formData.nombre || !formData.edad) {
      setError('Por favor complete todos los campos para el registro.');
      setLoading(false);
      return;
    }

    try {
      // Llamar al servicio de registro
      await authService.register(formData);

      setSuccess('¡Registro exitoso! Revisa tu correo para verificar tu cuenta antes de iniciar sesión.');

      // Limpiar
      setFormData({ correo: '', password: '', rol: '', nombre: '', edad: '' });

      // Regresar al login automáticamente
      setTimeout(() => {
        setIsRegister(false);
        setSuccess('');
      }, 5000);

    } catch (err) {
      setError(err.message || 'Error al registrar. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }

    return; // ⬅️ IMPORTANTE: evita que siga con el login
  }

  // ---------------------------
  //  🔹 MODO LOGIN
  // ---------------------------

  if (!formData.correo || !formData.password) {
    setError('Por favor complete todos los campos');
    setLoading(false);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.correo)) {
    setError('Por favor ingrese un correo válido');
    setLoading(false);
    return;
  }

  try {
    const response = await authService.login(formData.correo, formData.password);

    const userData = response?.user
      ? {
          ...response.user,
          email: response.user.email || response.user.correo || formData.correo,
          correo: response.user.correo || response.user.email || formData.correo,
          rol: response.user.rol || response.rol || response.user_role || 'cliente',
        }
      : {
          email: formData.correo,
          correo: formData.correo,
          rol: response?.rol || response?.user_role || 'cliente',
        };

    const token = response?.token;

    login(userData, token);

    setSuccess('Ingresando...');

  } catch (err) {
    setError(err.message || 'Credenciales incorrectas. Por favor intente nuevamente.');
  } finally {
    setLoading(false);
  }
};

  

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Card de login */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Sellos-G
            </h1>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold text-slate-300">
                {isRegister ? 'Registro' : 'Iniciar Sesión'}
              </h2>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Toggle entre Login y Registro */}
          <div className="flex gap-2 mb-6 bg-slate-700/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
                setSuccess('');
                setFormData({
                  correo: '',
                  password: '',
                  rol: '',
                  nombre: '',
                  edad: '',
                });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${!isRegister
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
                setSuccess('');
                setFormData({
                  correo: '',
                  password: '',
                  rol: '',
                  nombre: '',
                  edad: '',
                });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${isRegister
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campos de registro */}
            {isRegister && (
              <>
                {/* Campo de nombre */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-700/50 border border-slate-600 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all text-slate-200 placeholder-slate-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Campo de edad */}
                <div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      placeholder="Edad"
                      min="1"
                      max="120"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-700/50 border border-slate-600 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all text-slate-200 placeholder-slate-500"
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campo de corrreo */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-700/50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-slate-200 placeholder-slate-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-700/50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-slate-200 placeholder-slate-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/*
            {/* Campo de rol solo para login }
            {!isRegister && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">Tipo de usuario</label>
                <select
                  name="rol"
                  value={formData.rol || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-slate-200"
                  disabled={loading}
                >
                  <option value="">Seleccione un rol</option>
                  <option value="administrador">Administrador</option>
                  <option value="empleado">Empleado</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
            )}
            */}

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                {success}
              </div>
            )}

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                isRegister 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'
              } text-white py-3.5 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isRegister ? 'Registrando...' : 'Ingresando...'}
                </>
              ) : (
                isRegister ? 'Registrarse' : 'Ingresar'
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Texto decorativo inferior */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Sellos digitales de última generación. Asegura tu identidad y protege tus documentos con nuestra
              tecnología de vanguardia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;