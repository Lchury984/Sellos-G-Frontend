// src/services/authService.mock.js

export const authService = {
    login: async (email, password) => {
        // Simula un retraso de red
        await new Promise((res) => setTimeout(res, 500));

        const fakeUsers = [
            { email: "admin@test.com", password: "123456", rol: "administrador", nombre: "Admin Usuario" },
            { email: "empleado@test.com", password: "123456", rol: "empleado", nombre: "Empleado Usuario" },
            { email: "cliente@test.com", password: "123456", rol: "cliente", nombre: "Cliente Usuario" },
        ];

        const user = fakeUsers.find((u) => u.email === email && u.password === password);

        if (user) {
            return {
                user: { id: 1, nombre: user.nombre, email: user.email, rol: user.rol },
                token: "mocked-jwt-token-123456",
            };
        } else {
            throw { message: "Correo o contraseña incorrectos" };
        }
    },

    logout: async () => {
        return { message: "Sesión cerrada (mock)" };
    },

    forgotPassword: async (email) => {
        await new Promise(res => setTimeout(res, 500));
        return { message: "Correo de recuperación enviado (mock)" };
    },

    resetPassword: async (token, newPassword) => {
        await new Promise(res => setTimeout(res, 500));
        return { message: "Contraseña actualizada (mock)" };
    },

    updateProfile: async (userId, userData) => {
        await new Promise(res => setTimeout(res, 500));
        return { message: "Perfil actualizado (mock)" };
    },

    updatePassword: async (userId, currentPassword, newPassword) => {
        await new Promise(res => setTimeout(res, 500));
        return { message: "Contraseña actualizada (mock)" };
    }
};
