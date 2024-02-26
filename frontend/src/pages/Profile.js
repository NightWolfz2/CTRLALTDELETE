import {useState, React} from 'react';
import './../css/Profile.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import {useUpdatePassword} from '../hooks/useUpdatePassword';
import { useSendOTP } from '../hooks/useSendOTP';

const Profile = () => { 
  const { user } = useAuthContext();
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [OTP, setOTP] = useState('');
  const {updatePassword} = useUpdatePassword()
  const {sendOTP,deleteOTP} = useSendOTP()

  const handleResetPasswordClick = () => {
    setShowResetPasswordForm(true);
    sendOTP(user.email)
  };

  const handleCancelResetPassword = () => {
    deleteOTP(user.email)
    setShowResetPasswordForm(false);
    // Reset input fields
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleResetPasswordSubmit = async(e) => {
    await updatePassword(user.email,currentPassword,newPassword, OTP)
    // Reset input fields and hide the form
    setCurrentPassword('');
    setNewPassword('');
    setShowResetPasswordForm(false);
  };          

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
          <div className="profile-info-row">
            <FaEnvelope className="icon" />
            <span><strong>Verified:</strong> {'Verified'}
            </span>
          </div>
          <div className="profile-action">
            {showResetPasswordForm ? (
              <div className="reset-password-form">
                <input 
                  type="password" 
                  placeholder="Current Password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
                <input 
                  type="OTP" 
                  placeholder="OTP" 
                  value={OTP} 
                  onChange={(e) => setOTP(e.target.value)} 
                />
                <button onClick={handleResetPasswordSubmit}>Submit</button>
                <button onClick={handleCancelResetPassword}>Cancel</button>
              </div>
            ) : (
              <button className="profile-button resetPW" onClick={handleResetPasswordClick}>
                <FaLock className="icon" />
                Change Password
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;