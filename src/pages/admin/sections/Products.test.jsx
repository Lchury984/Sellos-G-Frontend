import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Products from './Products'

vi.mock('../../services/productService', () => ({
  default: {
    obtenerProductos: vi.fn(() => Promise.resolve({ data: [{ id: 1, nombre: 'Producto 1' }] }))
  }
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: true })
}))

describe('Products Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
