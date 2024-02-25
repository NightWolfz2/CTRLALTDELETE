const express = require('express');
// Removed duplicate imports and included 'verifyEmail' from the same 'userController' import
const { loginUser, signupUser, getEmployees, verifyEmail } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth'); // Assuming this middleware exists to check for authenticated users
const { getUserById } = require('../controllers/userController');
const { getUserDetails } = require('../controllers/userController');
const router = express.Router();

// Route for user login
router.post('/login', loginUser);

// Route for user signup
router.post('/signup', signupUser);

// Route for verifying email
router.post('/verify-email', verifyEmail); // Make sure 'verifyEmail' is implemented in your 'userController'

// New route for fetching employees. Protected by requireAuth middleware
router.get('/employees', requireAuth, getEmployees);

// New route for fetching a user by ID. Protected by requireAuth middleware
router.get('/id', requireAuth, getUserById);

router.get('/:id', getUserDetails);



module.exports = router;
