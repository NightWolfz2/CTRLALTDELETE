import React from 'react';
import './../css/Profile.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';


const Profile = () => { 
  const { user } = useAuthContext();
  
  return (
    <div className='Profile'>
      <div className="page-title">
        <h2>Profile</h2>
      </div>
      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-info-row">
            <FaUserAlt className="icon" />
            <span><strong>Name:</strong> {user.fname} {user.lname}</span>
          </div>
          <div className="profile-info-row">
            <FaEnvelope className="icon" />
            <span><strong>Email:</strong> {user.email}</span>
          </div>
          <div className="profile-action">
            <button className="profile-button resetPW">
              <FaLock className="icon" />
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;