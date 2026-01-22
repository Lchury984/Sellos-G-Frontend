import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Statistics from './Statistics'

vi.mock('../../services/adminService', () => ({
  default: {
    obtenerEstadisticas: vi.fn(() => Promise.resolve({ data: { totalPedidos: 100 } }))
  }
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: true })
}))

describe('Statistics Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <Statistics />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
