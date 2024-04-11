const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { generateToken, mailTransport, generateEmailTemplate } = require('../utils/mail')
const verificationToken = require('../models/verificationToken')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['employee', 'admin', 'owner'],
        required: true,
        default: 'employee', // Default role
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    owner: {
        type: Boolean,
        default: false,
        required: true
    }
});

userSchema.index({ owner: 1 }, { unique: true, partialFilterExpression: { owner: true } });

userSchema.pre('save', async function(next) {
    if (!this.isNew) {
        next(); // Skip if not a new user being created
        return;
    }

    

    // Check if the user's email matches process.env.OWNER_EMAIL
    if (this.email === process.env.OWNER_EMAIL) {
        // Set the current user as the owner
        this.owner = true;
        this.role = 'owner';

        // If there are any existing owners, remove the owner flag from them
        await this.model('User').updateMany({ owner: true }, { $set: { owner: false, role: 'employee' } });
    } else {
        const existingOwner = await this.model('User').findOne({ owner: true });
        if (existingOwner) {
            // If an owner already exists, do nothing and proceed with the save operation
            next();
            return;
        }
        this.owner = true;
        this.role = 'owner';
    }
    

    next();
});

// static user sign up method
userSchema.statics.signup = async function(fname,lname,email, password) {
    // validation
    if(!email || !password) {
        throw Error('All fields must be filled')
    }
    // check email
    if(!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    // check if strong password
    if(!validator.isStrongPassword(password)) {
        throw Error('Password does not meet security requirements. Please ensure your password is at least 8 characters long, includes a mix of upper and lower case letters, numbers, and special characters (e.g., !, @, #). Avoid common words and sequences to enhance security.')
    }
    const exists = await this.findOne({email})
    // check if email exists
    if (exists) {
        throw Error('Email already in use.')
    }
    // security measure for passwords
    const extraMeasure = await bcrypt.genSalt(10)
    // hashing password
    const hash = await bcrypt.hash(password, extraMeasure)
    const user = await this.create({fname,lname,email, password: hash})

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
        html: generateEmailTemplate(OTP,user.fname),
    })
    return user
}

// static user login method
userSchema.statics.login = async function(email, password) {
    if(!email || !password) {
        throw Error('All fields must be filled')
    }
    const user = await this.findOne({email})
    // check if email exists
    if (!user) {
        throw Error('Incorrect email')
    }

    // check if password matches
    const userMatch = await bcrypt.compare(password, user.password)
    if(!userMatch) {
        throw Error('Incorrect credentials')
    }
    await user.save()
    return user
}

// Add a static method to the user schema for updating password
userSchema.statics.updatePassword = async function(email, currentPassword, newPassword) {
    if(!email || !currentPassword || !newPassword) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})
    // check if email exists
    if (!user) {
        throw Error('User not found')
    }
    // check if current password matches
    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if(!passwordMatch) {
        throw Error('Current password is incorrect')
    }
    // check if new password is strong
    if(!validator.isStrongPassword(newPassword)) {
        throw Error('New password is not strong enough')
    }
    // hashing new password
    const extraMeasure = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(newPassword, extraMeasure)

    // Update user's password
    await this.updateOne({email}, {password: newPasswordHash})

    return {message: 'Password updated successfully'}
}


module.exports = mongoose.model('User', userSchema)