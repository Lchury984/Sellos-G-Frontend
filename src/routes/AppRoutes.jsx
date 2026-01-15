// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Landing from '../pages/public/Landing';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';

import AdminDashboard from '../pages/admin/Dashboard';
import EmpleadoDashboard from '../pages/empleado/Dashboard';
import ClienteDashboard from '../pages/cliente/Dashboard';

import ProtectedLayout from '../components/layout/ProtectedLayout';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        const rol = user?.rol?.toLowerCase();
        if (rol === 'administrador' || rol === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (rol === 'empleado') return <Navigate to="/empleado/dashboard" replace />;
        if (rol === 'cliente') return <Navigate to="/cliente/dashboard" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>

            {/* LOGIN */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            {/* DASHBOARDS */}
            <Route
                path="/admin/dashboard/*"
                element={
                    <ProtectedLayout allowedRoles={['administrador', 'admin']}>
                        <AdminDashboard />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/empleado/dashboard/*"
                element={
                    <ProtectedLayout allowedRoles={['empleado']}>
                        <EmpleadoDashboard />
                    </ProtectedLayout>
                }
            />

            <Route
                path="/cliente/dashboard/*"
                element={
                    <ProtectedLayout allowedRoles={['cliente']}>
                        <ClienteDashboard />
                    </ProtectedLayout>
                }
            />

            {/* No Autorizado */}
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

            {/* Recuperación de contraseña */}
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />

            <Route
                path="/reset-password/:token"
                element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }
            />

            <Route
                path="/verificar-email"
                element={
                    <PublicRoute>
                        <VerifyEmail />
                    </PublicRoute>
                }
            />

            {/* Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* 404 */}
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
