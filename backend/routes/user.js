const express = require('express');
const { loginUser, signupUser, getEmployees } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth'); // Assuming this middleware exists to check for authenticated users

const router = express.Router();
const { loginUser, signupUser, verifyEmail } = require('../controllers/userController')

// Route for user login
router.post('/login', loginUser);

// Route for user signup
router.post('/signup', signupUser);

// New route for fetching employees. Protected by requireAuth middleware
router.get('/employees', requireAuth, getEmployees);

router.post('/verify-email', verifyEmail)


module.exports = router
