// routes/index.js (or api.js, depending on your project structure)
import { Router } from 'express';
 // Assuming you have a userController
import {
    createPortfolio,
    getPortfolio,
    updatePortfolio,
    deletePortfolio,
    getStudentProfile,
    getStudentProfiles,
    getProfileAnalytics
} from '../controllers/profileController.js'; // Ensure this path is correct
import { verifyToken } from '../middelware/protectedRoutes.js'; // Your authentication middleware

const router = Router();

router.post('/portfolio', verifyToken, createPortfolio);
router.get('/portfolio', verifyToken, getPortfolio);
router.get('/portfolio/:userId', getPortfolio);
router.put('/portfolio', verifyToken, updatePortfolio);
router.delete('/portfolio', verifyToken, deletePortfolio);

router.get('/profile/:userId', getStudentProfile);

// Get multiple student profiles with search, filter, and pagination
// Public route for browsing student directory
router.get('/profiles', getStudentProfiles);

// Get profile analytics and insights
// Public for basic stats, private for detailed analytics
router.get('/profile/:userId/analytics', getProfileAnalytics);



// Search profiles by skills (alternative endpoint)
router.get('/profiles/search', getStudentProfiles);

// Get profiles by specific skill
router.get('/profiles/skill/:skillName', async (req, res) => {
    try {
        const { skillName } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // Redirect to main profiles endpoint with skill filter
        req.query.skills = skillName;
        return getStudentProfiles(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching profiles by skill',
            error: error.message
        });
    }
});

// Get trending/popular profiles (most starred)
router.get('/profiles/trending', async (req, res) => {
    try {
        // Redirect to main profiles endpoint with star sorting
        req.query.sortBy = 'stars';
        req.query.sortOrder = 'desc';
        req.query.limit = req.query.limit || 20;
        return getStudentProfiles(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trending profiles',
            error: error.message
        });
    }
});

// Get recently joined profiles
router.get('/profiles/recent', async (req, res) => {
    try {
        // Redirect to main profiles endpoint with date sorting
        req.query.sortBy = 'created';
        req.query.sortOrder = 'desc';
        req.query.limit = req.query.limit || 15;
        return getStudentProfiles(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recent profiles',
            error: error.message
        });
    }
});

// ========================================
// PROFILE INTERACTION ROUTES
// ========================================

/**
 * Social Features Routes
 * These handle profile interactions like starring, following, etc.
 */

// Star/Like a profile (requires authentication)
router.post('/profile/:userId/star', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId;
        
        if (userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot star your own profile'
            });
        }

        // Import User model (you'll need to add this import at the top)
        const User = (await import('../models/userSchema.js')).default;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Increment stars (in a real app, you'd track who starred whom)
        user.stars = (user.stars || 0) + 1;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile starred successfully',
            newStarCount: user.stars
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error starring profile',
            error: error.message
        });
    }
});

// Add friend/connection (requires authentication)
router.post('/profile/:userId/connect', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.userId; 
        
        if (userId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot connect to yourself'
            });
        }

        const User = (await import('../models/userSchema.js')).default;
        
        const [currentUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(userId)
        ]);

        if (!currentUser || !targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already connected
        if (currentUser.friends.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Already connected to this user'
            });
        }

        // Add to friends list (bidirectional)
        currentUser.friends.push(userId);
        targetUser.friends.push(currentUserId);

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.status(200).json({
            success: true,
            message: 'Connection request sent successfully',
            data: {
                connectedTo: {
                    id: targetUser._id,
                    name: targetUser.name
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error connecting to profile',
            error: error.message
        });
    }
});

// ========================================
// PROFILE STATISTICS ROUTES
// ========================================

/**
 * Analytics and Statistics Routes
 */

// Get overall platform statistics
router.get('/stats/platform', async (req, res) => {
    try {
        const User = (await import('../models/userSchema.js')).default;
        
        const stats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    totalStars: { $sum: '$stars' },
                    totalProjects: { $sum: { $size: { $ifNull: ['$portfolio.projects', []] } } },
                    totalSkills: { $sum: { $size: { $ifNull: ['$portfolio.skills', []] } } },
                    avgStars: { $avg: '$stars' }
                }
            }
        ]);

        const platformStats = stats[0] || {
            totalUsers: 0,
            totalStars: 0,
            totalProjects: 0,
            totalSkills: 0,
            avgStars: 0
        };

        res.status(200).json({
            success: true,
            data: {
                platform: platformStats,
                lastUpdated: new Date()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching platform statistics',
            error: error.message
        });
    }
});

// Get skills statistics across the platform
router.get('/stats/skills', async (req, res) => {
    try {
        const User = (await import('../models/userSchema.js')).default;
        
        const skillsStats = await User.aggregate([
            { $unwind: { path: '$portfolio.skills', preserveNullAndEmptyArrays: false } },
            {
                $group: {
                    _id: { $toLower: '$portfolio.skills' },
                    count: { $sum: 1 },
                    users: { $addToSet: '$name' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 20 },
            {
                $project: {
                    skill: '$_id',
                    count: 1,
                    userCount: { $size: '$users' },
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                topSkills: skillsStats,
                totalUniqueSkills: skillsStats.length,
                lastUpdated: new Date()
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching skills statistics',
            error: error.message
        });
    }
});

// ========================================
// HEALTH CHECK AND INFO ROUTES
// ========================================

/**
 * API Information and Health Check Routes
 */

// API health check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Profile API is running',
        timestamp: new Date(),
        version: '1.0.0'
    });
});

// Get API documentation/endpoints info
router.get('/info', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Student Profile API',
        version: '1.0.0',
        endpoints: {
            portfolio: {
                'POST /portfolio': 'Create portfolio (auth required)',
                'GET /portfolio': 'Get own portfolio (auth required)',
                'GET /portfolio/:userId': 'Get user portfolio (public)',
                'PUT /portfolio': 'Update portfolio (auth required)',
                'DELETE /portfolio': 'Delete portfolio (auth required)'
            },
            profiles: {
                'GET /profile/:userId': 'Get detailed profile (public)',
                'GET /profiles': 'Get profiles list with filters (public)',
                'GET /profile/:userId/analytics': 'Get profile analytics'
            },
            search: {
                'GET /profiles/search': 'Search profiles',
                'GET /profiles/skill/:skillName': 'Get profiles by skill',
                'GET /profiles/trending': 'Get trending profiles',
                'GET /profiles/recent': 'Get recent profiles'
            },
            social: {
                'POST /profile/:userId/star': 'Star a profile (auth required)',
                'POST /profile/:userId/connect': 'Connect to profile (auth required)'
            },
            stats: {
                'GET /stats/platform': 'Get platform statistics',
                'GET /stats/skills': 'Get skills statistics'
            }
        },
        documentation: 'https://your-api-docs.com'
    });
});

export default router;