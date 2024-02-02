import {useState} from 'react'
import {useSignup} from "../hooks/useSignup"
import './../css/TaskForm.css'; // Import your CSS file

const Signup = () => {
    const [fname, setfName] = useState('')
    const [lname, setlName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isLoading} = useSignup()


const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(fname,lname,email, password)
    console.log(fname,lname,email, password)
}

return (
    <div>
        <form className="create" onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <label>First Name:</label>
                <input
                    type="text"
                    onChange={(e) => setfName(e.target.value)}
                    value = {fname}
                />
            <label>Last Name:</label>
            <input
                type="text"
                onChange={(e) => setlName(e.target.value)}
                value = {lname}
            />
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
            <button disabled={isLoading}>Sign Up</button>
            {error && <div className="error">{error}</div>}
        </form>
    </div>
    )
}
export default Signup