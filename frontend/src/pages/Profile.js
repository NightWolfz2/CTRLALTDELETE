import './../css/Profile.css'; // Import CSS file

const Profile = () => { 
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
        <label>Name: GENERIC NAME</label>
        <label>Email: GENERIC_EMAIL@EMAIL.COM</label>
      <button className='resetPW'>Reset Password</button>
      </div>
      </div>
    </div>
  )
}

export default Profile