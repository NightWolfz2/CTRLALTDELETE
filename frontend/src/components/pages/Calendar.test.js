import React from 'react';
import { render } from '@testing-library/react';
import CalendarPage from './Calendar';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import { AuthContextProvider } from "../../context/AuthContext"

// Define your mock tasks and user outside since you use them in multiple mocks
const mockTasks = [
  {
    _id: "6632ce97f94ae0919f478951",
    title: "Test",
    date: "2024-05-16T23:21:00.000+00:00",
    description: "Test",
    priority: "Medium",
    completed: true,
    deleted: false,
    createdBy: "661074dfcadf3d75882c5bc0",
    editHistory: [],
    employees: [],
    status: "In Progress",
    createdAt: "2024-05-01T23:21:59.153+00:00",
    updatedAt: "2024-05-01T23:21:59.153+00:00"
  },
  {
    _id: "661078b7cadf3d75882c664d",
    title: "Second High Task",
    date: "2024-05-01T22:18:00.000+00:00",
    description: "This is a description of the first medium task.",
    priority: "High",
    completed: false,
    deleted: false,
    createdBy: "65f9f180182751d1ec134671",
    editHistory: [],
    employees: [],
    status: "In Progress",
    createdAt: "2024-04-05T22:18:31.542+00:00",
    updatedAt: "2024-04-11T21:48:39.400+00:00",
  }
];


const mockUser = {
  user: {
    _id: "661074dfcadf3d75882c5bc0",
    fname: "John",
    lname: "Doe",
    email: "owner@gmail.edu",
    password: "$2b$10$eauToN8OV8yLUD9OzyeHRuBOxtD.fJxihklkBgwgWULro7eIMhL5O", // Replace with an actual hash or placeholder
    role: "owner",
    verified: true,
    owner: true
  },
  token: 'mockToken' // If you need to simulate an auth token
};


// Define your mock dispatch function
const mockDispatch = jest.fn();

describe('CalendarPage Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter> {/* Wrap CalendarPage with MemoryRouter */}
        <AuthContextProvider>
          <CalendarPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
  });


});
