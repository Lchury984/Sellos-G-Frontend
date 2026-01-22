import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';

// Mock del hook useAuth y AuthProvider
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: true,
    user: { rol: 'admin' },
    loading: false
  })),
  AuthProvider: ({ children }) => children
}))

describe('ProtectedLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when user is authenticated and has correct role', () => {
    render(
      <BrowserRouter>
        <ProtectedLayout allowedRoles={['admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedLayout>
      </BrowserRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

});
