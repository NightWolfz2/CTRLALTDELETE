import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import React from 'react';
import useTokenExpirationChecker from './hooks/useTokenExpirationChecker';

// pages & components
import Home from './components/pages/Home'
import Navbar from './components/Navbar'
import Bottombar from './components/Bottombar'
import TaskForm from './components/pages/TaskForm'
import CalendarPage from './components/pages/Calendar'
import Overview from './components/pages/Overview'
import History from './components/pages/History'
import EditHistory from './components/pages/EditHistory'
import Profile from './components/pages/Profile'
import LoggedOut from './components/pages/LogOut'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Verify from './components/pages/Verification'
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import Users from './components/pages/Users';


function App() {

  const TokenExpirationChecker = () => {
    useTokenExpirationChecker();
    return null; 
  }; 

  const {user} = useAuthContext()
  
  return (
    <div className='root'>
      <BrowserRouter>
        <Navbar />
        <TokenExpirationChecker />
        <div className='main-content'>
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
                element={<Login />}
              />
              <Route 
                path="/login"
                element={!user ? <Login />: <Navigate to="/"/>}
              />
              <Route 
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/verify-email"/>}
              />
              <Route 
                path="/signup"
                element={user && user.verified ? <Signup /> : <Navigate to="/verify-email"/>}
              />
              <Route 
                path="/verify-email"
                element = {user && !user.verified? < Verify />: <Navigate to="/" />}
              />
              <Route 
              path="/forgot-password"
              element={user ? <Navigate to="/" /> : <ForgotPassword />}
              />
              <Route 
              path="/reset-password/" // Include the :token parameter in the path
              element={user ? <Navigate to="/" /> : <ResetPassword />}
              />
              <Route 
              path="/users"
              element={user && user.role !== 'employee'? <Users /> : <Navigate to="/login" />}
              />
            </Routes>
          </div>
          <Bottombar />
          </BrowserRouter>
    </div>
  );
}

export default App;
