import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import UsersManagement from './UsersManagement'

vi.mock('../../services/adminService', () => ({
  default: {
    obtenerUsuarios: vi.fn(() => Promise.resolve({ data: [{ id: 1, nombre: 'Usuario 1' }] }))
  }
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: true })
}))

describe('Users Management Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <UsersManagement />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
