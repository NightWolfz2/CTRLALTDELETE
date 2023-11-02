import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages & components
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Bottombar from './components/Bottombar'
import TaskForm from './pages/TaskForm'
import Calendar from './pages/Calendar'
import Overview from './pages/Overview'
import History from './pages/History'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={<Home />}
            />
            <Route
              path="/createTask"
              element={<TaskForm />}
            />
            <Route
              path="/calendar"
              element={< Calendar />} // change this to calendar.js
            />
            <Route
              path="/Overview"
              element={<Overview />}
            />
            <Route
              path="/History"
              element={<History />}
            />
          </Routes>
        </div>
        <Bottombar />
      </BrowserRouter>
    </div>
  );
}

export default App;
