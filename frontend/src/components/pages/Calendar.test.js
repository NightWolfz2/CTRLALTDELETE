import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CalendarPage from './Calendar';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import { AuthContextProvider } from "../../context/AuthContext"

// Mock the useCustomFetch hook
jest.mock('../../hooks/useCustomFetch', () => ({
  useCustomFetch: jest.fn(),
}));


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

    expect(todayButton).toBeTruthy();
    expect(backButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    // Assert that all buttons are present
    expect(monthButton).toBeTruthy();
    expect(weekButton).toBeTruthy();
    expect(dayButton).toBeTruthy();

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
    expect(rbcViewLabel).toEqual("Thursday May 02");
    // Next button click
    fireEvent.click(nextButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("Friday May 03");
    agendaDate = getByTestId("3").textContent
    expect(agendaDate).toEqual("May 3, 2024");
    // Back button click
    fireEvent.click(backButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("Thursday May 02");
    // Today button click
    fireEvent.click(backButton);  //click back to go to May 01
    fireEvent.click(todayButton);
    rbcViewLabel = document.getElementsByClassName('rbc-toolbar-label')[0].textContent;
    expect(rbcViewLabel).toEqual("Thursday May 02");

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
    expect(dp_PrevBtn).toBeTruthy();


    const dp_NextBtn = getByLabelText('Next Month')
    expect(dp_NextBtn).toBeTruthy();
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
    expect(dp_Option).toBeTruthy();
    fireEvent.click(dp_Option);
    let agendaDate = getByTestId("3").textContent;
    expect(agendaDate).toEqual("June 28, 2024");

  });

});
