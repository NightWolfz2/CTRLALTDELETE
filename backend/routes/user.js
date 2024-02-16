const express = require('express')

const { loginUser, signupUser, verifyEmail } = require('../controllers/userController')

const router = express.Router()

// login
router.post('/login', loginUser)

// signup
router.post('/signup', signupUser)

router.post('/verify-email', verifyEmail)


module.exports = router