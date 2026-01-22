import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Orders from './Orders'

vi.mock('../../services/pedidoService', () => ({
  default: {
    obtenerTodosPedidos: vi.fn(() => Promise.resolve({ data: [{ id: 1, estado: 'pendiente' }] }))
  }
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: true })
}))

describe('Orders Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
