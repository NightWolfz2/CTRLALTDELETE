import React from 'react';
import { render, fireEvent, waitFor, getByText, screen } from '@testing-library/react';
import CalendarPage from './Calendar';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import { AuthContextProvider } from "../../context/AuthContext"
import '@testing-library/jest-dom';

// Mock the useCustomFetch hook
jest.mock('../../hooks/useCustomFetch', () => ({
  useCustomFetch: jest.fn(),
}));

jest.mock('../../hooks/useCustomFetch', () => ({
  useCustomFetch: () => jest.fn(() => Promise.resolve(mockTasks))
}));

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: () => ({ user: mockUser })
}));

const mockTasks = [
  {
    id: "task",
    title: "FattusChungus",
    date: "2024-05-02T15:00:00.000Z",
    priority: "Low",
    completed: true,
    editHistory: [],
    employees: [],
    status: "In Progress",
  }
];

const mockUser = {
  user: {
    _id: "user1",
    fname: "Jane",
    lname: "Doe",
    token: "fakeToken123"
  }
};


describe('CalendarPage Component', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter> <AuthContextProvider>
        <CalendarPage />
      </AuthContextProvider></MemoryRouter> 
    );
  });

  it('Displays today\'s date correctly', () => {
    const { getByTestId } = render(     
      <MemoryRouter> <AuthContextProvider>
        <CalendarPage />
      </AuthContextProvider></MemoryRouter> 
    );
    const todayString = getByTestId("1").textContent  ;
    const today = new Date();
    const thisString = `Today is ${today.toLocaleDateString('en-CA', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
    expect(todayString).toEqual(thisString);
  });

  it('Displays the agenda header and date correctly', () => {
    const { getByTestId } = render(     
      <MemoryRouter> <AuthContextProvider>
        <CalendarPage />
      </AuthContextProvider></MemoryRouter> 
    );
    const agendaHeader = getByTestId("2").textContent  ;
    const agendaDate = getByTestId("3").textContent
    const today = new Date();
    const thisString = `${today.toLocaleDateString('en-CA', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
    expect(agendaHeader).toEqual("Agenda");
    expect(agendaDate).toEqual(thisString);
  });
  
  it('Displays agenda table column headers correctly', () => {
    const { getByTestId } = render(     
      <MemoryRouter> <AuthContextProvider>
        <CalendarPage />
      </AuthContextProvider></MemoryRouter> 
    );
    const col_1 = getByTestId("4").textContent;
    const col_2 = getByTestId("5").textContent;
    const col_3 = getByTestId("6").textContent;
  
    expect(col_1).toEqual("Due");
    expect(col_2).toEqual("Task");
    expect(col_3).toEqual("Complete");
  });

  it('All rbc buttons work as expected', () => {
    const { getByRole, getByTestId } = render(     
      <MemoryRouter> <AuthContextProvider>
        <CalendarPage />
      </AuthContextProvider></MemoryRouter> 
    );

    // Find buttons by their ARIA role
    const todayButton = getByRole('button', { name: 'Today' });
    const backButton = getByRole('button', { name: 'Back' });
    const nextButton = getByRole('button', { name: 'Next' });
    const monthButton = getByRole('button', { name: 'Month' });
    const weekButton = getByRole('button', { name: 'Week' });
    const dayButton = getByRole('button', { name: 'Day' });

    expect(todayButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    // Assert that all buttons are present
    expect(monthButton).toBeInTheDocument();
    expect(weekButton).toBeInTheDocument();
    expect(dayButton).toBeInTheDocument();

    let agendaDate = getByTestId("3").textContent;
    let rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("April 28 – May 04");
    
    // Simulate button clicks
    // Month button click
    fireEvent.click(monthButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("May 2024");
    // Week button click
    fireEvent.click(weekButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("April 28 – May 04");
    // Day button click
    fireEvent.click(dayButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("Friday May 03");
    // Next button click
    fireEvent.click(nextButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("Saturday May 04");
    agendaDate = getByTestId("3").textContent
    expect(agendaDate).toEqual("May 4, 2024");
    // Back button click
    fireEvent.click(backButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("Friday May 03");
    // Today button click
    fireEvent.click(backButton);  //click back to go to May 01
    fireEvent.click(todayButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("Friday May 03");

  });


  it('Date-picker functions as expected',() => {

    const { getByLabelText, getByTestId } = render(
      <MemoryRouter>
        <AuthContextProvider>
          <CalendarPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    
    const dp_PrevBtn = getByLabelText('Previous Month')
    expect(dp_PrevBtn).toBeInTheDocument();


    const dp_NextBtn = getByLabelText('Next Month')
    expect(dp_NextBtn).toBeInTheDocument();
    let dp_MonthLabel = document.getElementsByClassName('react-datepicker__current-month')[0].textContent;
    expect(dp_MonthLabel).toEqual('May 2024');
    fireEvent.click(dp_PrevBtn);
    dp_MonthLabel = document.getElementsByClassName('react-datepicker__current-month')[0].textContent;
    expect(dp_MonthLabel).toEqual('April 2024');
    fireEvent.click(dp_NextBtn);
    fireEvent.click(dp_NextBtn);
    dp_MonthLabel = document.getElementsByClassName('react-datepicker__current-month')[0].textContent;
    expect(dp_MonthLabel).toEqual('June 2024');
    
    let dp_Option = getByLabelText('Choose Friday, June 28th, 2024');
    expect(dp_Option).toBeInTheDocument();
    fireEvent.click(dp_Option);
    let agendaDate = getByTestId("3").textContent;
    expect(agendaDate).toEqual("June 28, 2024");

  });

    it('Selects a day in week view', async () => {
      const { getByText } = render(
        <MemoryRouter>
          <AuthContextProvider>
            <CalendarPage />
          </AuthContextProvider>
        </MemoryRouter>
      );
  
      // Navigate to week view if not already in it
      fireEvent.click(getByText('Week'));
  
      // Assuming that "01 Wed" is visible and clickable in the current view
      fireEvent.click(getByText('01 Wed'));
  
      // Check if the selected date has changed to "01 Wed"
      // This assumes you have a way to display the selected date or some related change
      await waitFor(() => {
        const selectedDate = getByText('May 1, 2024'); // Adjust the format and text as per your application
        expect(selectedDate).toBeInTheDocument();
      });
    });
  
    it('Selects a day in weeks view and then months view ', async () => {
      const { getByText } = render(
        <MemoryRouter>
          <AuthContextProvider>
            <CalendarPage />
          </AuthContextProvider>
        </MemoryRouter>
      );
      
      // Click on day header in week view
      fireEvent.click(getByText('01 Wed'));

      // Verify changes, e.g., a task list for the selected day or the date being highlighted
      await waitFor(() => {
        const selectedDayTasks = getByText('May 1, 2024');
        expect(selectedDayTasks).toBeInTheDocument();
      });

      // Navigate to month view
      fireEvent.click(getByText('Month'));
  
      // Click on a day number
      fireEvent.click(getByText('02')); // Click on the first day of the month shown
  
      // Verify changes, e.g., a task list for the selected day or the date being highlighted
      await waitFor(() => {
        const selectedDayTasks = getByText('May 2, 2024');
        expect(selectedDayTasks).toBeInTheDocument();
      });

    });

  /*
  it('Displays tasks correctly', async () => {
    const { getByLabelText, screen } = render(
      <MemoryRouter>
        <AuthContextProvider>
          <CalendarPage />
        </AuthContextProvider>
      </MemoryRouter>
    );
    // Get the element by aria-label
    await waitFor(() => {
      expect(screen.getByLabelText('FattusChungus')).toBeInTheDocument();
    });
  
   
  
  // Assert that the element is found
  expect(taskElement).toBeInTheDocument();
    
  });
*/
   
  
});
