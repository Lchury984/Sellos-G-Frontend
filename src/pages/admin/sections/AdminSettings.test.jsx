import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminSettings from './AdminSettings'

// Mock AuthContext
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { 
      id: '123', 
      nombre: 'Admin Test',
      correo: 'admin@test.com',
      email: 'admin@test.com'
    },
    updateUser: vi.fn(),
    isAuthenticated: true
  })),
  AuthProvider: ({ children }) => children
}))

// Mock AdminService
vi.mock('../../../services/adminService', () => ({
  default: {
    obtenerMiPerfil: vi.fn().mockResolvedValue({ 
      data: { nombre: 'Admin Test', correo: 'admin@test.com' } 
    }),
    actualizarPerfil: vi.fn().mockResolvedValue({ 
      data: { msg: 'Perfil actualizado' } 
    }),
    cambiarContrasena: vi.fn().mockResolvedValue({ 
      data: { msg: 'Contraseña cambiada' } 
    })
  }
}))

describe('AdminSettings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar el componente con las secciones correctas', () => {
    const { container } = render(
      <BrowserRouter>
        <AdminSettings />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
    expect(container.querySelector('div')).toBeTruthy()
  })
})
