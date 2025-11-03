import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Configuración global para los tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));