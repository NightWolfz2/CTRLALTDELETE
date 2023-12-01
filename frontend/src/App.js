import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages & components
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Bottombar from './components/Bottombar'
import TaskForm from './pages/TaskForm'
import CalendarPage from './pages/Calendar'
import Overview from './pages/Overview'
import History from './pages/History'
import EditHistory from './pages/EditHistory'
import Profile from './pages/Profile'
import LoggedOut from './pages/LogOut'


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
              element={< CalendarPage />} // change this to calendar.js
            />
            <Route
              path="/overview"
              element={<Overview />}
            />
            <Route
              path="/history"
              element={<History />}
            />
            <Route
              path="/editTask/:_id"
              element={<EditHistory />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route 
              path="/loggedOut"
              element={<LoggedOut />}
            />
          </Routes>
        </div>
        <Bottombar />
      </BrowserRouter>
    </div>
  );
}

export default App;
