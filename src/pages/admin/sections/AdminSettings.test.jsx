import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminSettings from './AdminSettings'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '123', nombre: 'Admin Test' },
    isAuthenticated: true,
    updateProfile: vi.fn()
  })
}))

vi.mock('../../services/adminService', () => ({
  default: {
    obtenerMiPerfil: vi.fn(() => Promise.resolve({ data: { nombre: 'Admin' } }))
  }
}))

describe('AdminSettings Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <AdminSettings />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
