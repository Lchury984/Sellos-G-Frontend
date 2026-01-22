import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Chat from './Chat'

vi.mock('../../services/chatService', () => ({
  default: {
    obtenerConversaciones: vi.fn(() => Promise.resolve({ data: [{ id: 1 }] }))
  }
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: '1' }, isAuthenticated: true })
}))

describe('Chat Component', () => {
  it('debe renderizar sin errores', () => {
    const { container } = render(
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
  })
})
