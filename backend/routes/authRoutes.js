// routes/authRoutes.js
import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile, // Import the new update controller
  getUserPublicProfile, // Import the new public profile controller
  // You might also add logoutUser here later
} from '../controllers/authController.js'; // Ensure this path is correct
import { verifyToken } from '../middelware/protectedRoutes.js'; // Ensure this path is correct

const router = Router();

// --- Authentication Routes ---

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Login user & get token
 * @access  Public
 */
router.post('/login', loginUser);

// --- User Profile Routes ---

/**
 * @route   GET /api/users/me
 * @desc    Get the logged-in user's profile
 * @access  Private (Requires Token)
 */
router.get('/me', verifyToken, getCurrentUser);

/**
 * @route   PUT /api/users/me
 * @desc    Update the logged-in user's profile
 * @access  Private (Requires Token)
 */
router.put('/me', verifyToken, updateUserProfile);

/**
 * @route   GET /api/users/:id
 * @desc    Get a user's public profile by ID
 * @access  Public
 */
router.get('public/:id', getUserPublicProfile);


// --- Optional: Add Logout ---
router.post('/logout', (req, res) => {
  // Logic to handle logout, usually involves clearing the cookie
  res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


// --- TODO: Add routes for Friends & Stars ---
// router.post('/friends/:id/add', verifyToken, addFriend);
// router.delete('/friends/:id/remove', verifyToken, removeFriend);
// router.post('/portfolio/:id/star', verifyToken, starPortfolio); // Or maybe without token if anyone can star


export default router;