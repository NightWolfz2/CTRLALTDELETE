const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    // authenication verification
    const{authorization}=req.headers

    if(!authorization) {
        return res.status(401).json({error:'Authorization token required'})
    }
    // get the header's token
    const token = authorization.split(' ')[1]
    // verify token
    try {
        const {_id} = jwt.verify(token,process.env.SECRET)
        req.verif = await User.findOne({_id}).select('_id')
        next()
    }catch(error) {
        console.log(error)
        res.status(401).json({error: 'Request not authorized'})
    }

}

module.exports = requireAuth