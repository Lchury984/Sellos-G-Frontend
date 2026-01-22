import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CompanyData from './CompanyData'

vi.mock('../../services/companyService', () => ({
  default: {
    obtenerConfiguracion: vi.fn(() => Promise.resolve({
      data: { nombre: 'Test Company', correo: 'company@test.com' }
    })),
    actualizarConfiguracion: vi.fn(() => Promise.resolve({ data: {} }))
  }
}))

describe('CompanyData Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <CompanyData />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
