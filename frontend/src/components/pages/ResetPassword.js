import React, { useState } from 'react';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useLocation} from "react-router";
import queryString from 'query-string'
import axios from "axios"
import '../../css/ResetPassword.css';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [invalidUser, setInvalidUser] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { token, id } = queryString.parse(location.search);
  const baseUrl = 'http://localhost:4000/api/user';

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setBusy(true);
        await axios.post(`${baseUrl}/verify-token?token=${token}&id=${id}`);
        setBusy(false);
      } catch (error) {
        if (error?.response?.data) {
          const { data } = error.response;
          if (!data.success) setInvalidUser(data.error);
        }
        setBusy(false);
      }
    };

    verifyToken();
  }, [token, id, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const { data } = await axios.post(`${baseUrl}/reset-password?token=${token}&id=${id}`, { password });
      if (data.success) {
        setSuccess(true);
        navigate('/login');
      }
    } catch (error) {
      setError('Failed to reset password.');
    }
  };

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  if (busy) return <div>Loading...</div>;
  if (invalidUser) return <div>{invalidUser}</div>;
  if (success) return <div>Password reset successful</div>;

  return (
    <div className="reset-password-container">
      <div className="reset-password-content">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            name="password"
            onChange={handleOnChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            name="confirmPassword"
            onChange={handleOnChange}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
