// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Páginas de autenticación
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Dashboards por rol
import AdminDashboard from '../pages/admin/Dashboard';
import EmpleadoDashboard from '../pages/empleado/Dashboard';  // correcto
import ClienteDashboard from '../pages/cliente/Dashboard';

// Componente de ruta protegida
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verificar si el usuario tiene el rol permitido
    if (allowedRoles && !allowedRoles.includes(user?.rol?.toLowerCase())) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return children;
};

// Reutilizar el ProtectedLayout centralizado
import ProtectedLayout from '../components/layout/ProtectedLayout';

// Componente para redirigir usuarios autenticados
const PublicRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        // Redirigir según rol
        switch (user?.rol?.toLowerCase()) {
            case 'administrador':
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />;
            case 'empleado':
                return <Navigate to="/empleado/dashboard" replace />;
            case 'cliente':
                return <Navigate to="/cliente/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta pública - Login */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            {/* Rutas del Administrador */}
                {/* Rutas de recuperación y restablecimiento de contraseña */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['administrador', 'admin']}>
                        <ProtectedLayout allowedRoles={['administrador', 'admin']}>
                            <AdminDashboard />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            {/* Rutas del Empleado */}
            <Route
                path="/empleado/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['empleado']}>
                        <ProtectedLayout allowedRoles={['empleado']}>
                            <EmpleadoDashboard />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            {/* Rutas del Cliente */}
            <Route
                path="/cliente/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                        <ProtectedLayout allowedRoles={['cliente']}>
                            <ClienteDashboard />
                        </ProtectedLayout>
                    </ProtectedRoute>
                }
            />

            {/* Página de no autorizado */}
            <Route
                path="/no-autorizado"
                element={
                    <div className="h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">403</h1>
                            <p className="text-gray-600">No tienes permiso para acceder a esta página</p>
                        </div>
                    </div>
                }
            />

            {/* Rutas de recuperación y restablecimiento de contraseña */}
            <Route
                path="/recuperar-contrasena"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }
            />

            {/* Ruta por defecto - redirige a login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 - Página no encontrada */}
            <Route
                path="*"
                element={
                    <div className="h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                            <p className="text-gray-600">Página no encontrada</p>
                        </div>
                    </div>
                }
            />

        </Routes>
    );
};

export default AppRoutes;