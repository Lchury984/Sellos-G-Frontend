import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Chat from './Chat'

// Mock AuthContext
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { 
      id: '1',
      nombre: 'Admin Test',
      rol: 'administrador',
      email: 'admin@test.com'
    },
    isAuthenticated: true,
    logout: vi.fn()
  })),
  AuthProvider: ({ children }) => children
}))

// Mock ChatService
vi.mock('../../../services/chatService', () => ({
  default: {
    getConversations: vi.fn().mockResolvedValue([]),
    getMessages: vi.fn().mockResolvedValue([]),
    sendMessage: vi.fn().mockResolvedValue({ data: { msg: 'Mensaje enviado' } }),
    createConversation: vi.fn().mockResolvedValue({ id: '1', nombre: 'Conversación' }),
    uploadMedia: vi.fn().mockResolvedValue({ url: '/uploads/test.jpg' }),
    connect: vi.fn(() => ({
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn()
    })),
    onNewMessage: vi.fn(),
    onMessageNotification: vi.fn(),
    offNewMessage: vi.fn(),
    offMessageNotification: vi.fn(),
    disconnect: vi.fn()
  }
}))

// Mock UserService
vi.mock('../../../services/userService', () => ({
  default: {
    getUsuarios: vi.fn().mockResolvedValue([]),
    obtenerUsuarios: vi.fn().mockResolvedValue({ data: [] }),
    getEmpleados: vi.fn().mockResolvedValue([]),
    getClientes: vi.fn().mockResolvedValue([]),
    obtenerEmpleados: vi.fn().mockResolvedValue({ data: [] })
  }
}))

describe('Chat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar el componente Chat correctamente', () => {
    const { container } = render(
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    )
    expect(container).toBeTruthy()
    expect(container.querySelector('div')).toBeTruthy()
  })
})
