import User from '../models/userSchema.js'; // Assuming userSchema.js exports the model
import jwt from 'jsonwebtoken';
import generateToken from '../middelware/generateCookies.js'; // Ensure this path is correct

// --- Configuration ---
// It's highly recommended to use environment variables for secrets
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODk3NzA0NTAsImV4cCI6MTY4OTc3NDA1MCwiaXNzIjoieW91ci1hcHAtbmFtZSJ9.9vJ6U9cZJTXNkfUetJ3_tPU3YJTRk0U3km0eI1-mW-Y';


export const registerUser = async (req, res) => {
  try {
    const { email, password, name,role, dateOfBirth, phone } = req.body;
    console.log(req.body);
    
    // --- Basic Validation ---
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // --- Check for Existing User ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // --- Create New User ---
    // Only include fields that are provided, Mongoose will use defaults for others
    const newUser = new User({
      email,
      password, // Password will be hashed by the pre-save hook
      name,
      role,
      ...(dateOfBirth && { dateOfBirth }), // Conditionally add if provided
      ...(phone && { phone }),             // Conditionally add if provided
      // Portfolio, friends, and stars will use schema defaults
    });

    // --- Save User ---
    const savedUser = await newUser.save();

    // --- Generate Token & Set Cookie ---
    // Pass the complete user object with the required properties
    generateToken({
      userId: savedUser._id,
      email: savedUser.email
    }, res);

    // --- Send Success Response ---
    // Avoid sending back the full user object, especially the password (even if hashed)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
      },
    });

  } catch (error) {
    console.error('Error during registration:', error);
    // Handle Mongoose validation errors more gracefully
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = generateToken({ userId: user._id, email: user.email }, res);

    // Send success response
    res.status(200).json({
      message: 'Login successful',
      user: { email: user.email, name: user.name },
      token, // Optional if token is set in cookie
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.user;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(token.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // --- Update Fields ---
        // Update basic fields if provided
        user.name = req.body.name || user.name;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
        user.phone = req.body.phone || user.phone;
        // Email change usually requires verification, handle with care (or disallow here)
        // Password change should have its own dedicated route and logic.

        // --- Update Portfolio Fields ---
        // Check if portfolio data is sent and update accordingly
        if (req.body.portfolio) {
            const { bio, avatar, skills, projects, experience, education, socialLinks, resumeUrl } = req.body.portfolio;

            user.portfolio.bio = bio ?? user.portfolio.bio; // Use ?? to allow empty strings
            user.portfolio.avatar = avatar ?? user.portfolio.avatar;
            user.portfolio.skills = skills ?? user.portfolio.skills;
            user.portfolio.projects = projects ?? user.portfolio.projects;
            user.portfolio.experience = experience ?? user.portfolio.experience;
            user.portfolio.education = education ?? user.portfolio.education;
            user.portfolio.resumeUrl = resumeUrl ?? user.portfolio.resumeUrl;

            // Handle nested socialLinks carefully
            if (socialLinks) {
                user.portfolio.socialLinks.linkedin = socialLinks.linkedin ?? user.portfolio.socialLinks.linkedin;
                user.portfolio.socialLinks.github = socialLinks.github ?? user.portfolio.socialLinks.github;
                user.portfolio.socialLinks.website = socialLinks.website ?? user.portfolio.socialLinks.website;
                user.portfolio.socialLinks.twitter = socialLinks.twitter ?? user.portfolio.socialLinks.twitter;
            }
        }

        // --- Save Updated User ---
        const updatedUser = await user.save();

        // --- Send Response ---
        res.status(200).json({
            message: 'Profile updated successfully',
            user: { // Send back relevant, non-sensitive updated info
                _id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
                portfolio: updatedUser.portfolio,
                // Add other fields as needed
            }
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
         if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a user's public profile (for portfolio view)
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -friends -email -phone -dateOfBirth'); // Exclude sensitive info

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('Error fetching public profile:', error);
        // Handle CastError if ID format is wrong
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

