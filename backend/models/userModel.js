const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

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
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})
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
        throw Error('Password not strong enough')
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

    return user
}

module.exports = mongoose.model('User', userSchema)

