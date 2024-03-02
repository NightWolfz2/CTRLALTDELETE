import React, { useState } from 'react';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useLocation} from "react-router";
import queryString from 'query-string'
import axios from "axios"

function ResetPassword() {
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: ''
  })
  const [invalidUser, setInvalidUser] = useState("");
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false)
  const location = useLocation();
  const baseUrl = 'http://localhost:4000/api/user';
  const {token, id} = queryString.parse(location.search)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const {password,confirmPassword} = newPassword
    if(password.trim().length < 8 || password.trim().length > 20) {
      return setError('Password must be 8 to 20 characters.')
    }
    if(password!==confirmPassword) {
      return setError('Password does not match.')
    }
    try {
      const {token, id} = queryString.parse(location.search)
      const {data } = await axios.post(`${baseUrl}/reset-password?token=${token}&id=${id}`,{password});
      setBusy(false);
      if (data.success) {
        setSuccess(true)
        navigate('/reset-password')

      }
    } catch (error) {
      setBusy(false);
      if(error?.response?.data) {
        const {data} = error.response;
        if(!data.sucess) return setInvalidUser(data.error)
        return console.log(error.response.data)
      }
      console.log(error)
    }
  };
  const verifyToken = async() => {
    try {
      setBusy(true)
      const {data } = await axios.post(`${baseUrl}/verify-token?token=${token}&id=${id}`,{password: newPassword});
      setBusy(false);
      
    } catch (error) {
      if(error?.response?.data) {
          const {data} = error.response;
        if(!data.sucess) return setInvalidUser(data.error)
        return console.log(error.response.data)
      }
      console.log(error)
    }
    
  }
  useEffect(() => {
    verifyToken();
  }, []);
  const handleOnChange = ({target}) => {
    const {name, value} = target;
    setNewPassword({...newPassword, [name]:value})
  }
  if (invalidUser) {
    return (
      <div>
        <h1>{invalidUser}</h1>
      </div>
    )
  }
  if (success) {
    return (
      <div>
        <h1>Password reset successful</h1>
      </div>
    )
  }

    

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="**********"
          name='password'
          onChange={handleOnChange}
          required
        />
        <input
          type="password"
          placeholder="**********"
          name='confirmPassword'
          onChange={handleOnChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ResetPassword;
