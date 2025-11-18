// src/pages/auth/Login.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
//import { authService } from "../../services/authService.mock";
import { authService } from '../../services/authService';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Calendar } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
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
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isRegister) {
      // Validaciones para registro
      if (!formData.nombre || !formData.edad || !formData.email || !formData.password) {
        setError('Por favor complete todos los campos');
        setLoading(false);
        return;
      }

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor ingrese un correo válido');
        setLoading(false);
        return;
      }

      // Validación de edad
      const edad = parseInt(formData.edad);
      if (isNaN(edad) || edad < 1 || edad > 120) {
        setError('Por favor ingrese una edad válida');
        setLoading(false);
        return;
      }

      // Validación de contraseña
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      try {
        // Llamar al servicio de registro
        await authService.register({
          nombre: formData.nombre,
          edad: edad,
          email: formData.email,
          password: formData.password,
        });

        setSuccess('¡Registro exitoso! Se ha enviado un correo de verificación a tu email. Por favor verifica tu cuenta antes de iniciar sesión.');
        
        // Limpiar formulario
        setFormData({
          email: '',
          password: '',
          rol: '',
          nombre: '',
          edad: '',
        });

        // Cambiar a modo login después de 3 segundos
        setTimeout(() => {
          setIsRegister(false);
          setSuccess('');
        }, 5000);

      } catch (err) {
        setError(err.message || 'Error al registrar. Por favor intente nuevamente.');
      } finally {
        setLoading(false);
      }
    } else {
      // Validaciones para login
      if (!formData.email || !formData.password) {
        setError('Por favor complete todos los campos');
        setLoading(false);
        return;
      }

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor ingrese un correo válido');
        setLoading(false);
        return;
      }

      if (!formData.rol) {
        setError('Por favor seleccione un tipo de usuario');
        setLoading(false);
        return;
      }

      try {
        // Llamar al servicio de login
        const response = await authService.login(formData.email, formData.password, formData.rol);

        // Guardar token y datos del usuario
        login(response.user, response.token);

      } catch (err) {
        setError(err.message || 'Credenciales incorrectas. Por favor intente nuevamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Card de login */}
      <div className="w-full max-w-md relative">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Sellos-G</h1>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold text-gray-600">
                {isRegister ? 'Registro' : 'Login'}
              </h2>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Toggle entre Login y Registro */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
                setSuccess('');
                setFormData({
                  email: '',
                  password: '',
                  rol: '',
                  nombre: '',
                  edad: '',
                });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isRegister
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
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
                  email: '',
                  password: '',
                  rol: '',
                  nombre: '',
                  edad: '',
                });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isRegister
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos de registro */}
            {isRegister && (
              <>
                {/* Campo de nombre */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre completo"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Campo de edad */}
                <div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      placeholder="Edad"
                      min="1"
                      max="120"
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campo de email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Campo de rol solo para login */}
            {!isRegister && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">Tipo de usuario</label>
                <select
                  name="rol"
                  value={formData.rol || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                  disabled={loading}
                >
                  <option value="">Seleccione un rol</option>
                  <option value="administrador">Administrador</option>
                  <option value="empleado">Empleado</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
            )}


            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
              to="/recuperar-contrasena"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Texto decorativo inferior */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              sellos digitales pogjin. Asegura tu identidad y protege tus documentos con nuestra
              tecnología de vanguardia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;