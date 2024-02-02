import {useState} from 'react'
import {useLogin} from '../hooks/useLogin'
import './../css/TaskForm.css'; // Import your CSS file

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()


const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email,password)
}

return (
    <form className="create" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>Email: </label>
        <input 
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value = {email}
        />
        <label>Password: </label>
        <input 
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value = {password}
        />
        <button disabled={isLoading}>Login</button>
        {error && <div className="error">{error}</div>}
    </form>
    )
}
export default Login