const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const verificationToken = require('../models/verificationToken'); // Adjust the path as necessary to match your file structure
const { sendForgotPasswordEmail } = require('../utils/mail');
const crypto = require('crypto');
const { generateToken, mailTransport, generatePasswordTemplate } = require('../utils/mail')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({
            email, 
            fname: user.fname, 
            lname: user.lname, 
            token
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const signupUser = async (req, res) => {
    const {fname, lname, email, password} = req.body;
    try {
        const user = await User.signup(fname, lname, email, password);
        const token = createToken(user._id);
        res.status(200).json({fname, lname, email, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const getfName = async(req, res) => {
    const { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: 'No such user' });
    }
    const user = await User.findById(_id);
    
    if (!user) {
        return res.status(404).json({ error: 'No such user' });
    }
    
    res.status(200).json({ fname: user.fname });
};

const getlName = async(req, res) => {
    const { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: 'No such user' });
    }
    const user = await User.findById(_id);
    
    if (!user) {
        return res.status(404).json({ error: 'No such user' });
    }
    
    res.status(200).json({ lname: user.lname });
};

const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }, 'fname lname email').exec();
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }

    if (!['employee', 'admin'].includes(newRole)) {
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: `User role updated to ${newRole}`, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params; // Make sure to use 'id' to match the route parameter

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No such user');
    }

    try {
        const user = await User.findById(id).select('fname lname email role');
        if (!user) {
            return res.status(404).send('No such user');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ fname: user.fname, lname: user.lname, email: user.email, role: user.role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Consolidated module.exports
module.exports = { signupUser, loginUser, getfName, getlName, getEmployees, updateUserRole };
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
const deleteOTP = async(req, res) => {
    const {email} = req.body

    if(!email) return res.status(401).json({ error: 'Invalid request, missing parameters!' })
    const user = await User.findOne({email})

    const token = await verificationToken.findOne({owner: user._id})

    if(!token) return

    await verificationToken.findByIdAndDelete(token._id);
}
const sendOTP = async(req,res) => {
    const {email} = req.body

    if(!email) return res.status(401).json({ error: 'Invalid request, missing parameters!' })
    const user = await User.findOne({email})
    const OTP = generateToken()
    const verifyToken = new verificationToken({
        owner: user._id,
        token: OTP
    })


    await verifyToken.save()

    mailTransport().sendMail({
        from: 'emailverification@email.com',
        to: user.email,
        subject: "Verify your email account",
        html: generatePasswordTemplate(OTP,user.fname),
    })
}

const updateUserPassword = async (req, res) => {
    const {email, currentPassword, newPassword, otp} = req.body
    const user = await User.findOne({ email: email });
    const token = await verificationToken.findOne({owner: user._id})

    if(!token) return res.status(401).json({ error: 'user not found!' });

    const isMatched = await token.compareToken(otp)

    if(!isMatched) return res.status(401).json({ error: 'Please provide a valid token!' });

    await verificationToken.findByIdAndDelete(token._id);
    if(isMatched) {
        try {
            const result = await User.updatePassword(email, currentPassword, newPassword)
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    };
}
    

    const resetPassword = async (req, res) => {
      const { token, newPassword } = req.body;
      const verificationToken = await VerificationToken.findOne({ token: { $regex: token } });
      if (!verificationToken || !await verificationToken.compareToken(token)) {
        return res.status(400).send('Invalid or expired token.');
      }
    
      const user = await User.findById(verificationToken.owner);
      if (!user) {
        return res.status(404).send('User not found.');
      }
    
      user.password = await bcrypt.hash(newPassword, 8); // Hash the new password
      await user.save();
      await verificationToken.delete();
    
      res.send('Password has been reset successfully.');
    };
      
    const forgotPassword = async (req, res) => {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send('No user with that email.');
      }
    
      const resetToken = crypto.randomBytes(20).toString('hex');
      await new verificationToken({
        owner: user._id,
        token: resetToken,
      }).save();
    
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendForgotPasswordEmail(email, user, resetLink); // Adjusted to include resetLink
      
      res.send('Password reset email sent.');
    };
    
module.exports = {
    signupUser,
    loginUser,
    getfName,
    getlName,
    getEmployees,
    getUserById,
    updateUserRole,
    verifyEmail,
    getUserDetails,
    sendOTP,
    deleteOTP,
    updateUserPassword,
    forgotPassword, 
    resetPassword
};
