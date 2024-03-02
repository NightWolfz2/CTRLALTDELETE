const User = require('../models/userModel')
const ResetToken = require('../models/resetToken')
const { isValidObjectId } = require("mongoose");

exports.isResetTokenValid = async (req, res, next) => {
    const {token, id} = req.query;
    if(!token || !id) return res.status(404).send('Invalid request');

    if(!isValidObjectId(id)) return res.status(404).send('Invalid user');
    console.log(`ID: ${id}`)
    console.log(`Token: ${token}`)
    const user = await User.findById(id)
    if(!user) return res.status(404).send('user not found');

    const resetToken = await ResetToken.findOne({owner: user._id})

    if(!resetToken) return res.status(404).send('Token not found');

    const isValid = await resetToken.compareToken(token)

    if(!isValid) return res.status(404).send('token is invalid');

    req.user = user
    next()
}