// src/context/AuthContext.jsx (VERSION ANTI-BUCLE ESTABLE)

import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Evita múltiples redirecciones
    const isRedirectingRef = useRef(false);

    const ROLES = {
        ADMIN: ['administrador', 'admin'],
        EMPLEADO: ['empleado'],
        CLIENTE: ['cliente'],
    };

    const getTargetRoute = (rol) => {
        const rolLower = rol?.toLowerCase();
        if (ROLES.ADMIN.includes(rolLower)) return '/admin/dashboard';
        if (ROLES.EMPLEADO.includes(rolLower)) return '/empleado/dashboard';
        if (ROLES.CLIENTE.includes(rolLower)) return '/cliente/dashboard';
        return '/login';
    };

    // 1. Cargar estado inicial desde localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsed = JSON.parse(storedUser);

                if (parsed && (parsed.rol || parsed.role)) {
                    setToken(storedToken);
                    setUser(parsed);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    // 2. MANEJO DE REDIRECCIÓN SIN BUCLES
    useEffect(() => {
        // No ejecutar si:
        if (loading || !token || !user || isRedirectingRef.current) return;

        const target = getTargetRoute(user.rol || user.role);

        // Solo redirige en rutas públicas
        if (location.pathname === '/' || location.pathname === '/login') {
            isRedirectingRef.current = true;

            setTimeout(() => {
                navigate(target, { replace: true });
                isRedirectingRef.current = false;
            }, 0);
        }

    }, [loading, token, user, navigate]); 
    // ❗ No incluimos location.pathname → evita ciclos

    // Login
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    const updateUser = (partialUser) => {
        setUser((prev) => {
            const merged = { ...(prev || {}), ...(partialUser || {}) };
            localStorage.setItem('user', JSON.stringify(merged));
            return merged;
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                updateUser,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
