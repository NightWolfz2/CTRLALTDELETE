import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarPage from './Calendar';
import { BrowserRouter as Router } from 'react-router-dom';

// Setup global fetch mock
global.fetch = jest.fn();

// Mock hooks and dependencies
jest.mock('../../hooks/useCustomFetch', () => ({
  useCustomFetch: () => jest.fn().mockImplementation(() => global.fetch)
}));

jest.mock('../../hooks/useLogout', () => ({
  useLogout: () => ({ logout: jest.fn() })
}));

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: () => ({ user: { id: 'user1', token: 'token123' } })
}));

// Helper function to render the component within the necessary providers
const renderComponent = () => render(
  <Router>
    <CalendarPage />
  </Router>
);

describe('CalendarPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    fetch.mockClear();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]), // Assume it resolves to an empty task list for simplicity
    });
  });

  it('renders correctly', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText(/Today is/)).toBeInTheDocument());
  });

  it('handles date change', async () => {
    renderComponent();
    const datePicker = await screen.findByClassName('react-datepicker__input-container');
    fireEvent.change(datePicker, { target: { value: new Date() } });
    await waitFor(() => expect(screen.getByText(/Agenda/)).toBeInTheDocument());
  });

  it('adds an employee to a task', async () => {
    renderComponent();
    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: /Edit/ }); // Ensure the Edit button is rendered
      fireEvent.click(editButton);
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'new_employee_id' } });
      fireEvent.click(screen.getByRole('button', { name: /Add Employee/ }));
      expect(select).toHaveValue('new_employee_id');
    });
  });

  // Additional tests for other interactions and state changes...
});
