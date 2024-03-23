import validator from 'validator';

const PasswordStrengthBox = ({password, display}) => {
    if(!display) return;

    if(!validator.isStrongPassword(password)) {
        return (
            <div className="password-strength-box error">
                <b>Your password is not strong enough. New passwords must:</b>
                <ul>
                    <li>Be at least 8 characters long</li>
                    <li>Contain one or more numbers</li>
                    <li>Include at least one special character (e.g., !, @, #)</li>
                </ul>
            </div>
        )
    } else {
        return;
    }
}

export default PasswordStrengthBox;