import { cleanup, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, expect, test, vi } from 'vitest';
afterEach(cleanup);
vi.mock('./authentification', () => ({
  keycloak: { authenticated: false, login: vi.fn(), logout: vi.fn() },
  possedePortee: () => false,
}));
import App from './App';
test('affiche une connexion explicite', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
});
test('ne présente pas de violation accessibilité détectable', async () => {
  const { container } = render(<App />);
  const violations = (await axe.run(container, { rules: { 'color-contrast': { enabled: false } } }))
    .violations;
  expect(violations, JSON.stringify(violations)).toHaveLength(0);
});
