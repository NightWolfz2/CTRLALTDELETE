const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
    // Authentication verification
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'});
    }
    // Get the token from the header
    const token = authorization.split(' ')[1];

    try {
        const {_id} = jwt.verify(token, process.env.SECRET);
        req.user = await User.findOne({_id}).select('_id');
        next();
    } catch (error) {
        // Specifically check for token expiration error
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({error: 'Token expired'});
        } else {
            console.log(error);
            res.status(401).json({error: 'Request not authorized'});
        }
    }
};

module.exports = requireAuth;