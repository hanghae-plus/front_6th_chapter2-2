import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const renderWithRouter = (
  component: React.ReactNode,
  { route = '/' } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>
  );
};
