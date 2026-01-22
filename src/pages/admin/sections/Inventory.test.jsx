import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Inventory from './Inventory'

vi.mock('../../services/inventoryService', () => ({
  default: {
    obtenerInventario: vi.fn(() => Promise.resolve({ data: [{ id: 1, stock: 50 }] }))
  }
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: true })
}))

describe('Inventory Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <Inventory />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
