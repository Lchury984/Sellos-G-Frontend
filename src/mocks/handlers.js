import { rest } from 'msw';

// In-memory store for tokens (development only)
const tokens = new Map();

// Simple fake users for demo (use same emails as mockService)
const fakeUsers = [
  { id: 1, email: 'admin@test.com', nombre: 'Admin Usuario', rol: 'administrador' },
  { id: 2, email: 'empleado@test.com', nombre: 'Empleado Usuario', rol: 'empleado' },
  { id: 3, email: 'cliente@test.com', nombre: 'Cliente Usuario', rol: 'cliente' },
];

function makeToken() {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

export const handlers = [
  // Forgot password
  rest.post('*/auth/forgot-password', async (req, res, ctx) => {
    const { email } = await req.json();
    // Always return generic message, but generate token if email exists
    const user = fakeUsers.find(u => u.email === email);
    if (user) {
      const token = makeToken();
      const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour
      tokens.set(token, { email, expiresAt });

      // For development convenience include token in response so you can copy the link
      return res(
        ctx.status(200),
        ctx.json({ message: 'Si existe la cuenta, se envió un email con instrucciones', token })
      );
    }

    return res(ctx.status(200), ctx.json({ message: 'Si existe la cuenta, se envió un email con instrucciones' }));
  }),

  // Reset password
  rest.post('*/auth/reset-password', async (req, res, ctx) => {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return res(ctx.status(400), ctx.json({ message: 'Token o contraseña faltante' }));
    }

    const row = tokens.get(token);
    if (!row) return res(ctx.status(400), ctx.json({ message: 'Token inválido o expirado' }));
    if (row.expiresAt < Date.now()) {
      tokens.delete(token);
      return res(ctx.status(400), ctx.json({ message: 'Token expirado' }));
    }

    // Simulate password update
    tokens.delete(token);

    return res(ctx.status(200), ctx.json({ message: 'Contraseña actualizada (mock-msw)' }));
  }),
];
