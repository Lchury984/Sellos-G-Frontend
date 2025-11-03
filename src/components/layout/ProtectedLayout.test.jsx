import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import ProtectedLayout from './ProtectedLayout';

// Mock del hook useAuth
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { rol: 'admin' },
    loading: false
  })
}));

describe('ProtectedLayout', () => {
  it('renders children when user is authenticated and has correct role', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedLayout allowedRoles={['admin']}>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedLayout>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    vi.mock('../../context/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: null,
        loading: true
      })
    }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedLayout allowedRoles={['admin']}>
            <div>Protected Content</div>
          </ProtectedLayout>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});