import { vi } from 'vitest'

export const mockAuthContext = {
  user: {
    id: '123',
    nombre: 'Test User',
    correo: 'test@example.com',
    rol: 'cliente'
  },
  isAuthenticated: true,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn()
}

export const createMockAuthProvider = (overrides = {}) => {
  return {
    ...mockAuthContext,
    ...overrides
  }
}
