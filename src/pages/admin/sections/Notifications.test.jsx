import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Notifications from './Notifications'

vi.mock('../../services/notificationService', () => ({
  default: {
    obtenerNotificaciones: vi.fn(() => Promise.resolve({ data: [{ id: 1 }] }))
  }
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: true })
}))

describe('Notifications Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <Notifications onNotificationsChange={vi.fn()} />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
