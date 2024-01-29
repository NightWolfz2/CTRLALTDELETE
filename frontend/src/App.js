import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
// pages & components
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Bottombar from './components/Bottombar'
import TaskForm from './pages/TaskForm'
import Calendar from './pages/Calendar'
import Overview from './pages/Overview'
import History from './pages/History'
<<<<<<< Updated upstream
=======
import EditHistory from './pages/EditHistory'
import Profile from './pages/Profile'
import LoggedOut from './pages/LogOut'
import Login from './pages/Login'
import Signup from './pages/Signup'
>>>>>>> Stashed changes


function App() {
  const {user} = useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/createTask"
              element={user ?<TaskForm />: <Navigate to="/login" />}
            />
            <Route
              path="/calendar"
<<<<<<< Updated upstream
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
=======
              element={user ?< CalendarPage />: <Navigate to="/login" />} // change this to calendar.js
            />
            <Route
              path="/overview"
              element={user ?<Overview />: <Navigate to="/login" />}
            />
            <Route
              path="/history"
              element={user ?<History />: <Navigate to="/login" />}
            />
            <Route
              path="/editTask/:_id"
              element={user ?<EditHistory />: <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ?<Profile />: <Navigate to="/login" />}
            />
            <Route 
              path="/loggedOut"
              element={<LoggedOut />}
            />
            <Route 
              path="/login"
              element={!user ? <Login />: <Navigate to="/"/>}
            />
            <Route 
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/"/>}
            />
>>>>>>> Stashed changes
          </Routes>
        </div>
        <Bottombar />
      </BrowserRouter>
    </div>
  );
}

export default App;
