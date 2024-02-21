const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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

// Consolidated module.exports
module.exports = { signupUser, loginUser, getfName, getlName, getEmployees, updateUserRole };
