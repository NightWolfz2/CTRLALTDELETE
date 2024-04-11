const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const verificationToken = require('../models/verificationToken'); // Adjust the path as necessary to match your file structure
const ResetToken = require('../models/resetToken')
const bcrypt = require('bcrypt')
const { generateToken, mailTransport, generatePasswordTemplate, sendForgotPasswordEmail, sendForgotPasswordEmailConfirm } = require('../utils/mail');
const { createRandomBytes } = require('../utils/helper');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'}); 
};

const calculateTokenExpiration = () => {
    const expiresIn = 72; // 3 days in hrs
    return new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString();
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        const expiration = calculateTokenExpiration(); // Calculate token's expiration time

        res.status(200).json({
            email,
            fname: user.fname,
            lname: user.lname,
            role: user.role,
            owner: user.owner,
            token,
            expiration 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
    const roles = ['employee', 'admin', 'owner'];
    try {
        //const employees = await User.find({ role: 'employee' }, 'fname lname email').exec();
        const employees = await User.find({ role: { $in: roles } }, 'fname lname email owner role').exec(); // new code
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const assignAdmin = async (req, res) => {
    const {user, updatingUser} = req.body;
 
    if (!user) {
        return res.status(400).json({ error: 'Invalid request, deletingUser!' });
    }
    if (!updatingUser) {
        return res.status(400).json({ error: 'Invalid request, missing updatingUser!' });
    } 
    if(user.email === updatingUser.email) {
        return res.status(403).json({ error: 'You do not have permission to promote yourself' });
    }
    if(updatingUser.owner) {
        return res.status(400).json({ error: 'Owner is maximum promotion' });
    }
    if(updatingUser.role === "admin" && user.role === "Admin") {
        return res.status(400).json({ error: 'User is already admin' });
    }

    if(user.role === "employee") {
        return res.status(401).json({ error: 'Only admins or owner can assign admins' });
    }
    const updatedUser = await User.findOneAndUpdate(
        { _id: updatingUser }, // Filter criteria to find the user
        { role: "admin" }, // Update to be applied
        { new: true } // To return the updated document
      );
    if (!updatedUser) {
        return res.status(400).json({ error: 'No such user' });
    }
    return res.status(200).json({success: `Assigned ${updatedUser.fname} to: ${updatedUser.role}`})
};

const unassignAdmin = async (req, res) => {
    const {user, updatingUser} = req.body;

    if (!user) {
        return res.status(400).json({ error: 'Invalid request, deletingUser!' });
    }
    if (!updatingUser) {
        return res.status(400).json({ error: 'Invalid request, missing updatingUser!' });
    } 
    if(user.email === updatingUser.email) {
        return res.status(403).json({ error: 'You do not have permission to demote yourself' });
    }
    if(updatingUser.owner) {
        return res.status(400).json({ error: 'Owner is maximum promotion' });
    }
    if(updatingUser.role === "employee") {
        return res.status(400).json({ error: 'User is already an employee' });
    }
    if(!user.owner) {
        return res.status(401).json({ error: 'Only owner can unassign admins' });
    }
    const updatedUser = await User.findOneAndUpdate(
        { _id: updatingUser }, // Filter criteria to find the user
        { role: "employee" }, // Update to be applied
        { new: true } // To return the updated document
      );
    if (!updatedUser) {
        return res.status(400).json({ error: 'No such user' });
    }
    return res.status(200).json({success: `Assigned ${updatedUser.fname} to: ${updatedUser.role}`})
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
  // delete a task
  const deleteUser = async (req, res) => {
    const { deletingUser, userToDelete } = req.body;
  
    if (!deletingUser) {
      return res.status(400).json({ error: 'Invalid request, deletingUser!' });
    }
    if (!userToDelete) {
      return res.status(400).json({ error: 'Invalid request, missing userToDelete!' });
    } 
    if (deletingUser.email === userToDelete.email) {
      return res.status(403).json({ error: 'You do not have permission to delete yourself' });
    }
    if (userToDelete.owner) {
      return res.status(403).json({ error: 'You do not have permission to delete the owner' });
    }
  
    try {
      if (deletingUser.owner) {
        const deletedUser = await User.findOneAndDelete({ _id: userToDelete });
        if (!deletedUser) {
          return res.status(404).json({ error: 'No such user' });
        }
  
        // Update tasks where the deleted user is referenced
        await Task.updateMany({ createdBy: userToDelete }, { $set: { createdBy: null } });
        await Task.updateMany({ updatedBy: userToDelete }, { $set: { updatedBy: null } });
        await Task.updateMany({}, { $pull: { employees: userToDelete } }); // Remove from all employee arrays
  
        res.status(200).json({ message: `User ${deletedUser.email} deleted and tasks updated.` });
      } else {
        return res.status(401).json({ error: 'You do not have permission to perform this action' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete user and update tasks' });
    }
  };
  


// Consolidated module.exports
module.exports = { signupUser, loginUser, getfName, getlName, getEmployees, assignAdmin, unassignAdmin };
const verifyEmail = async(req, res) => {
    const {email, otp} = req.body

    if(!email || !otp) return res.status(401).json({ error: 'Invalid request, missing parameters!' })

    const user = await User.findOne({ email: email });

    if(!user) return res.status(401).json({ error: 'Invalid Code!' })

    if(user.verified) return res.status(401).json({ error: 'Account already verified' });

    const token = await verificationToken.findOne({owner: user._id})

    if(!token) return res.status(401).json({ error: 'Invalid Code!' });

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

    await verificationToken.deleteMany({owner: user._id});

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

    if(!token) return res.status(401).json({ error: 'Please provide a valid token!' });

    const isMatched = await token.compareToken(otp)
    await verificationToken.findByIdAndDelete(token._id);

    if(!isMatched) return res.status(401).json({ error: 'Please provide a valid token!' });

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
      const {password} = req.body
      const user = await User.findById(req.user._id)
      if(!user) return res.status(404).send('user not found');

      const userMatch = await bcrypt.compare(password, user.password)

      if(userMatch) return res.status(404).send('New password must be different');

      if(password.trim().length < 8 || password.trim().length > 20) return res.status(404).send('Must be 8 to 20 char long');
      const extraMeasure = await bcrypt.genSalt(10)
      const newPasswordHash = await bcrypt.hash(password, extraMeasure)

      user.password = newPasswordHash;
    
      await user.save();
      

      await ResetToken.findOneAndDelete({owner: user._id})

      mailTransport().sendMail({
        from: 'NinjaManagerSecurity@gmail.com',
        to: user.email,
        subject: "Password Reset Successfully",
        html: sendForgotPasswordEmailConfirm(),
      });
        res.json({success: true, message: "Password Changed"})
    };
      
    const forgotPassword = async (req, res) => {
      const { email } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send('No user with that email.');
      }
    
      await ResetToken.deleteMany({owner: user._id});

      const randBytes = await createRandomBytes()
      const resetToken = ResetToken({owner: user._id, token: randBytes})

      await resetToken.save();

      mailTransport().sendMail({
        from: 'NinjaManagerSecurity@gmail.com',
        to: user.email,
        subject: "Password Reset",
        html: sendForgotPasswordEmail(`http://localhost:3000/reset-password?token=${randBytes}&id=${user._id}`),
    });
      res.json({success: true, message: 'Password Reset link is sent to your email.'})
    };

    
    
module.exports = {
    signupUser,
    loginUser,
    getfName,
    getlName,
    getEmployees,
    getUserById,
    assignAdmin,
    verifyEmail,
    getUserDetails,
    sendOTP,
    deleteOTP,
    updateUserPassword,
    forgotPassword, 
    resetPassword,
    deleteUser,
    unassignAdmin
};
