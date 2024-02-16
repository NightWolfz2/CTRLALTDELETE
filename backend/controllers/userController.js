const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const verificationToken = require('../models/verificationToken');
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email, password)
        // create token for user
        const token = createToken(user._id)
        res.status(200).json({
            email, 
            fname: user.fname, 
            lname: user.lname, 
            token
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const signupUser = async (req, res) => {
    const {fname, lname, email, password} = req.body
    try {
        const user = await User.signup(fname, lname, email, password)
        // create token for user
        const token = createToken(user._id)
        res.status(200).json({fname, lname, email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const verifyEmail = async(req, res) => {
    const {email, otp} = req.body

    if(!email || !otp) return res.status(401).json({ error: 'Invalid request, missing parameters!' })

    const user = await User.findOne({ email: email });
    console.log(email)

    if(!user) return res.status(401).json({ error: 'User not found' })

    if(user.verified) return res.status(401).json({ error: 'Account already verified' });

    const token = await verificationToken.findOne({owner: user._id})

    if(!token) return res.status(401).json({ error: 'user not found!' });

    const isMatched = await token.compareToken(otp)

    if(!isMatched) return res.status(401).json({ error: 'Please provide a valid token!' });

    user.verified = true;
    await user.save();
    await verificationToken.findByIdAndDelete(token._id);
    res.status(200).json({sucess: user.verified, message: `Verified: ${user.fname}`})
    return user
}

module.exports = { signupUser, loginUser,verifyEmail}
