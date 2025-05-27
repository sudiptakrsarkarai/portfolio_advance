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

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/me', verifyToken, getCurrentUser);

router.put('/me', verifyToken, updateUserProfile);

router.get('public/:id', getUserPublicProfile);


// --- Optional: Add Logout ---
router.post('/logout', (req, res) => {
  try {
    // Clear multiple possible cookie names that might store the JWT
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'strict',
      expires: new Date(0), // Set expiration to past date
      path: '/' // Ensure path matches the one used when setting
    };

    // Clear common JWT cookie names
    res.clearCookie('jwt', cookieOptions);
    res.clearCookie('token', cookieOptions);
    res.clearCookie('authToken', cookieOptions);
    res.clearCookie('accessToken', cookieOptions);
    
    // Also set them to empty string as backup
    res.cookie('jwt', '', cookieOptions);
    res.cookie('token', '', cookieOptions);
    res.cookie('authToken', '', cookieOptions);
    res.cookie('accessToken', '', cookieOptions);

    // Send success response
    res.status(200).json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error during logout' 
    });
  }
});


// --- TODO: Add routes for Friends & Stars ---
// router.post('/friends/:id/add', verifyToken, addFriend);
// router.delete('/friends/:id/remove', verifyToken, removeFriend);
// router.post('/portfolio/:id/star', verifyToken, starPortfolio); // Or maybe without token if anyone can star


export default router;