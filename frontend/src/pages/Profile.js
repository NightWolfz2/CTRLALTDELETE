import './../css/Profile.css'; // Import CSS file
import {useAuthContext} from '../hooks/useAuthContext'

const Profile = () => { 
  const {user} = useAuthContext()
  return (
    <div className="profile">
      <div className="page-title">
        <h2>Profile</h2>
      </div>
      <div className='info-container'>
        <div className='info-details'>
        <div className="info-header">
          <h4>USER INFORMATION</h4>
        </div>
        <label>Name: {user.fname + ' '+user.lname}</label>
        <label>Email: {user.email}</label>
      <button className='resetPW'>Reset Password</button>
      </div>
      </div>
    </div>
  )
}

export default Profile