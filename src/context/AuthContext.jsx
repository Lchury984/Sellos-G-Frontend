// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Verificar si hay un token guardado al cargar la app
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                // Validar que el usuario tenga al menos las propiedades esperadas
                if (parsed && (parsed.rol || parsed.role) && (parsed.nombre || parsed.name || parsed.email)) {
                    setToken(storedToken);
                    setUser(parsed);
                } else {
                    // Datos inválidos: limpiar
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (err) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Función de login
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirección según el rol - ejecutar en next tick para evitar navegación durante render
        setTimeout(() => {
            redirectByRole(userData?.rol || userData?.role);
        }, 0);
    };

    // Función de logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Redirección según rol
    const ROLES = {
        ADMIN: ['administrador', 'admin'],
        EMPLEADO: ['empleado'],
        CLIENTE: ['cliente']
    };

    // En la función redirectByRole:
    const redirectByRole = (rol) => {
        const rolLower = rol?.toLowerCase();
        let target = '/';
        if (ROLES.ADMIN.includes(rolLower)) {
            target = '/admin/dashboard';
        } else if (ROLES.EMPLEADO.includes(rolLower)) {
            target = '/empleado/dashboard';
        } else if (ROLES.CLIENTE.includes(rolLower)) {
            target = '/cliente/dashboard';
        } else {
            target = '/login';
        }

        // Evitar redireccionar si ya estamos en la ruta destino
        if (location?.pathname !== target) {
            navigate(target);
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};