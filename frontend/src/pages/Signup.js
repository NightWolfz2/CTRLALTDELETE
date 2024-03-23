import {useState} from 'react'
import {useSignup} from "../hooks/useSignup"
import './../css/TaskForm.css'; // Import your CSS file
import PasswordStrengthBox from "../components/PasswordStrengthBox";
import validator from 'validator';

const Signup = () => {
    const [fname, setfName] = useState('')
    const [lname, setlName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPasswordStrengthBox, setShowPasswordStrengthBox] = useState(false);
    const {signup, error, isLoading} = useSignup()


const handleSubmit = async (e) => {
    e.preventDefault()

    setShowPasswordStrengthBox(true);

    if(validator.isStrongPassword(password)) {
        setTimeout(() => signup(fname,lname,email, password), 1500);
    }
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
            <PasswordStrengthBox password={password} display={showPasswordStrengthBox} />
            <button disabled={isLoading}>Sign Up</button>
            {error && <div className="error">{error}</div>}
        </form>
    </div>
    )
}
export default Signup