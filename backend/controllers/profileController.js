import User from '../models/userSchema.js'; // Adjust the path as necessary
import mongoose from 'mongoose';

/**
 * @desc    Create/Initialize user portfolio
 * @route   POST /api/portfolio
 * @access  Private (authenticated users only)
 */
export const createPortfolio = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const {
            bio,
            avatar,
            skills,
            projects,
            experience,
            education,
            socialLinks,
            resumeUrl
        } = req.body;

        // Initialize or update the portfolio with provided data
        user.portfolio = {
            bio: bio || '',
            avatar: avatar || '',
            skills: skills || [],
            projects: projects || [],
            experience: experience || [],
            education: education || [],
            socialLinks: {
                linkedin: socialLinks?.linkedin || '',
                github: socialLinks?.github || '',
                website: socialLinks?.website || '',
                twitter: socialLinks?.twitter || ''
            },
            resumeUrl: resumeUrl || ''
        };

        const updatedUser = await user.save();

        res.status(201).json({
            message: 'Portfolio created successfully',
            portfolio: updatedUser.portfolio
        });

    } catch (error) {
        console.error('Error creating portfolio:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors 
            });
        }
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

/**
 * @desc    Get user's portfolio
 * @route   GET /api/portfolio/:userId?
 * @access  Public (if userId provided) / Private (for own portfolio)
 */
export const getPortfolio = async (req, res) => {
    try {
        // If userId is provided in params, get that user's portfolio (public view)
        // Otherwise, get the authenticated user's portfolio
        const targetUserId = req.params.userId || req.user?.userId;
        
        if (!targetUserId) {
            return res.status(401).json({ message: 'Unauthorized or user ID required' });
        }

        const user = await User.findById(targetUserId).select('name portfolio stars createdAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If viewing someone else's portfolio, include public info
        const responseData = {
            portfolio: user.portfolio,
            publicInfo: {
                name: user.name,
                stars: user.stars,
                memberSince: user.createdAt
            }
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error fetching portfolio:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

/**
 * @desc    Update user's portfolio
 * @route   PUT /api/portfolio
 * @access  Private (authenticated users only)
 */
export const updatePortfolio = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const {
            bio,
            avatar,
            skills,
            projects,
            experience,
            education,
            socialLinks,
            resumeUrl
        } = req.body;

        // Update portfolio fields selectively (only update provided fields)
        if (bio !== undefined) user.portfolio.bio = bio;
        if (avatar !== undefined) user.portfolio.avatar = avatar;
        if (skills !== undefined) user.portfolio.skills = skills;
        if (projects !== undefined) user.portfolio.projects = projects;
        if (experience !== undefined) user.portfolio.experience = experience;
        if (education !== undefined) user.portfolio.education = education;
        if (resumeUrl !== undefined) user.portfolio.resumeUrl = resumeUrl;

        // Handle nested socialLinks updates
        if (socialLinks) {
            if (socialLinks.linkedin !== undefined) {
                user.portfolio.socialLinks.linkedin = socialLinks.linkedin;
            }
            if (socialLinks.github !== undefined) {
                user.portfolio.socialLinks.github = socialLinks.github;
            }
            if (socialLinks.website !== undefined) {
                user.portfolio.socialLinks.website = socialLinks.website;
            }
            if (socialLinks.twitter !== undefined) {
                user.portfolio.socialLinks.twitter = socialLinks.twitter;
            }
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: 'Portfolio updated successfully',
            portfolio: updatedUser.portfolio
        });

    } catch (error) {
        console.error('Error updating portfolio:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: error.errors 
            });
        }
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

/**
 * @desc    Delete/Reset user's portfolio
 * @route   DELETE /api/portfolio
 * @access  Private (authenticated users only)
 */
export const deletePortfolio = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Reset portfolio to default empty state
        user.portfolio = {
            bio: '',
            avatar: '',
            skills: [],
            projects: [],
            experience: [],
            education: [],
            socialLinks: {
                linkedin: '',
                github: '',
                website: '',
                twitter: ''
            },
            resumeUrl: ''
        };

        await user.save();

        res.status(200).json({
            message: 'Portfolio deleted/reset successfully',
            portfolio: user.portfolio
        });

    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

export const getStudentProfile = async (req, res) => {
    // Helper function to get dynamic title based on portfolio
    const getDynamicTitle = (portfolio) => {
        if (!portfolio) return 'Student';
        if (portfolio.experience && portfolio.experience.length > 0) {
            const currentExperience = portfolio.experience.find(exp => !exp.endDate || new Date(exp.endDate) >= new Date());
            if (currentExperience) {
                return currentExperience.title + ' at ' + currentExperience.company;
            }
        }
        if (portfolio.education && portfolio.education.length > 0) {
            const latestEducation = portfolio.education.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
            return latestEducation.degree + ' from ' + latestEducation.institution;
        }
        if (portfolio.skills && portfolio.skills.length > 0) {
            return portfolio.skills[0] + ' Developer';
        }
        return 'Student';
    };

    // Helper function to format projects for display
    const formatProjects = (projects) => {
        return projects.map(project => ({
            title: project.title,
            description: project.description,
            link: project.link,
            imageUrl: project.imageUrl
        }));
    };

    // Helper function to format experience for display
    const formatExperience = (experience) => {
        return experience.map(exp => ({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description
        }));
    };

    // Helper function to format education for display
    const formatEducation = (education) => {
        return education.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            startDate: edu.startDate,
            endDate: edu.endDate
        }));
    };

    // Helper function to determine last active text
    const getLastActiveText = (createdAt) => {
        const diffMs = Date.now() - new Date(createdAt).getTime();
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (minutes < 5) return 'just now';
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 30) return `${days} days ago`;
        if (months < 12) return `${months} months ago`;
        return `${years} years ago`;
    };

    // Helper function to check online status (simple check based on last activity)
    const checkOnlineStatus = (createdAt) => {
        const fiveMinutes = 5 * 60 * 1000;
        return (Date.now() - new Date(createdAt).getTime()) < fiveMinutes;
    };


    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID format'
            });
        }

        // Find user, explicitly selecting fields that are not selected by default (e.g., password is 'select: false')
        // By default, Mongoose returns all fields except those with 'select: false'.
        // So, if we want *all* data visible to the public, we don't need a .select()
        // unless we want to explicitly exclude fields that are NOT 'select: false'
        // and are sensitive. In this case, 'password' is already excluded.
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({
                message: 'Student profile not found'
            });
        }

        // Calculate profile statistics
        const stats = {
            projectsCount: user.portfolio?.projects?.length || 0,
            friendsCount: user.friends?.length || 0,
            viewsCount: user.stars || 0, // Using stars as views for now
            skillsCount: user.portfolio?.skills?.length || 0,
            experienceCount: user.portfolio?.experience?.length || 0,
            educationCount: user.portfolio?.education?.length || 0
        };

        // Calculate profile completion percentage
        const completionFactors = {
            basicInfo: user.name && user.email ? 20 : 0,
            bio: user.portfolio?.bio ? 15 : 0,
            avatar: user.portfolio?.avatar ? 10 : 0,
            skills: user.portfolio?.skills?.length > 0 ? 15 : 0,
            projects: user.portfolio?.projects?.length > 0 ? 20 : 0,
            experience: user.portfolio?.experience?.length > 0 ? 10 : 0,
            education: user.portfolio?.education?.length > 0 ? 5 : 0,
            socialLinks: Object.values(user.portfolio?.socialLinks || {}).some(link => link) ? 5 : 0
        };

        const completionPercentage = Object.values(completionFactors).reduce((sum, val) => sum + val, 0);

        // Calculate account age and activity status
        const accountAge = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        const lastActiveText = getLastActiveText(user.createdAt);

        // Format response data
        const profileData = {
            // Basic Information
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.portfolio?.avatar || '/default-avatar.png',
            bio: user.portfolio?.bio || 'No bio available',

            // Professional Info
            title: getDynamicTitle(user.portfolio),
            skills: user.portfolio?.skills || [],

            // Statistics
            stats: {
                projects: stats.projectsCount,
                friends: stats.friendsCount,
                views: stats.viewsCount,
                stars: user.stars || 0
            },

            // Detailed Sections
            projects: formatProjects(user.portfolio?.projects || []),
            experience: formatExperience(user.portfolio?.experience || []),
            education: formatEducation(user.portfolio?.education || []),
            socialLinks: user.portfolio?.socialLinks || {},

            // Meta Information
            memberSince: user.createdAt,
            lastActive: lastActiveText,
            accountAgeDays: accountAge,
            profileCompletion: completionPercentage,
            isOnline: checkOnlineStatus(user.createdAt), // Simple online check

            // Contact Info (if available)
            contactInfo: {
                phone: user.phone || null,
                dateOfBirth: user.dateOfBirth || null,
                resumeUrl: user.portfolio?.resumeUrl || null
            }
        };

        res.status(200).json({
            success: true,
            data: profileData
        });

    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * @desc    Get multiple student profiles (for directory/listing)
 * @route   GET /api/profiles
 * @access  Public
 */
export const getStudentProfiles = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            skills = '',
            sortBy = 'stars',
            sortOrder = 'desc'
        } = req.query;

        // Build search query
        const searchQuery = {};
        if (search) {
            searchQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'portfolio.bio': { $regex: search, $options: 'i' } },
                { 'portfolio.skills': { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            searchQuery['portfolio.skills'] = { $in: skillsArray };
        }

        // Build sort object
        const sortObject = {};
        switch (sortBy) {
            case 'name':
                sortObject.name = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'stars':
                sortObject.stars = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'created':
                sortObject.createdAt = sortOrder === 'asc' ? 1 : -1;
                break;
            default:
                sortObject.stars = -1;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const [users, totalCount] = await Promise.all([
            User.find(searchQuery)
                .select('name portfolio stars createdAt friends')
                .sort(sortObject)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            User.countDocuments(searchQuery)
        ]);

        // Format profiles for listing
        const profiles = users.map(user => ({
            id: user._id,
            name: user.name,
            avatar: user.portfolio?.avatar || '/default-avatar.png',
            bio: user.portfolio?.bio || 'No bio available',
            title: getDynamicTitle(user.portfolio),
            skills: (user.portfolio?.skills || []).slice(0, 3), // Show only first 3 skills
            stats: {
                projects: user.portfolio?.projects?.length || 0,
                friends: user.friends?.length || 0,
                stars: user.stars || 0
            },
            memberSince: user.createdAt,
            isOnline: checkOnlineStatus(user.createdAt)
        }));

        // Pagination info
        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            totalItems: totalCount,
            itemsPerPage: parseInt(limit),
            hasNextPage: skip + profiles.length < totalCount,
            hasPrevPage: parseInt(page) > 1
        };

        res.status(200).json({
            success: true,
            data: profiles,
            pagination
        });

    } catch (error) {
        console.error('Error fetching student profiles:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profiles',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * @desc    Get profile analytics/insights
 * @route   GET /api/profile/:userId/analytics
 * @access  Private (own profile) or Public (basic stats)
 */
export const getProfileAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUserId = req.user?.userId;
        const isOwnProfile = requestingUserId === userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await User.findById(userId)
            .select('name portfolio stars createdAt friends')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Basic analytics available to everyone
        const basicAnalytics = {
            profileStrength: calculateProfileStrength(user),
            skillsDistribution: getSkillsDistribution(user.portfolio?.skills || []),
            activityScore: calculateActivityScore(user),
            membershipDuration: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        };

        // Advanced analytics only for own profile
        const advancedAnalytics = isOwnProfile ? {
            projectsTimeline: getProjectsTimeline(user.portfolio?.projects || []),
            experienceProgression: getExperienceProgression(user.portfolio?.experience || []),
            profileViews: user.stars || 0, // Assuming stars represent views
            connectionGrowth: user.friends?.length || 0,
            recommendations: getProfileRecommendations(user)
        } : {};

        res.status(200).json({
            success: true,
            data: {
                ...basicAnalytics,
                ...advancedAnalytics
            }
        });

    } catch (error) {
        console.error('Error fetching profile analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching analytics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Helper Functions

function getDynamicTitle(portfolio) {
    if (!portfolio || !portfolio.skills || portfolio.skills.length === 0) {
        return 'Student';
    }

    const skills = portfolio.skills.map(skill => skill.toLowerCase());
    
    // Determine title based on skills
    if (skills.some(skill => ['react', 'angular', 'vue', 'javascript', 'typescript'].includes(skill))) {
        return 'Frontend Developer';
    } else if (skills.some(skill => ['node', 'express', 'mongodb', 'sql', 'python', 'java'].includes(skill))) {
        return 'Backend Developer';
    } else if (skills.some(skill => ['fullstack', 'full-stack', 'mern', 'mean'].includes(skill))) {
        return 'Full Stack Developer';
    } else if (skills.some(skill => ['ui', 'ux', 'design', 'figma', 'adobe'].includes(skill))) {
        return 'UI/UX Designer';
    } else if (skills.some(skill => ['data', 'analytics', 'machine learning', 'ai'].includes(skill))) {
        return 'Data Scientist';
    } else if (skills.some(skill => ['mobile', 'react native', 'flutter', 'android', 'ios'].includes(skill))) {
        return 'Mobile Developer';
    }
    
    return 'Developer';
}

function formatProjects(projects) {
    return projects.map(project => ({
        title: project.title,
        description: project.description,
        link: project.link,
        imageUrl: project.imageUrl,
        technologies: extractTechnologies(project.description) // Extract from description
    }));
}

function formatExperience(experience) {
    return experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        duration: calculateDuration(exp.startDate, exp.endDate),
        isCurrent: !exp.endDate
    }));
}

function formatEducation(education) {
    return education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        startDate: edu.startDate,
        endDate: edu.endDate,
        duration: calculateDuration(edu.startDate, edu.endDate),
        isOngoing: !edu.endDate
    }));
}

function getLastActiveText(createdAt) {
    const diffMinutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60));
    
    if (diffMinutes < 5) return 'Active now';
    if (diffMinutes < 60) return `Active ${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Active ${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `Active ${diffDays} days ago`;
    
    return 'Active long ago';
}

function checkOnlineStatus(lastActivity) {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    return new Date(lastActivity).getTime() > fiveMinutesAgo;
}

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (diffMonths < 12) {
        return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    }
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? ` ${months} month${months !== 1 ? 's' : ''}` : ''}`;
}

function extractTechnologies(description) {
    if (!description) return [];
    
    const techKeywords = [
        'React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'TypeScript',
        'Python', 'Java', 'C++', 'SQL', 'PostgreSQL', 'MySQL', 'Vue.js',
        'Angular', 'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind'
    ];
    
    return techKeywords.filter(tech => 
        description.toLowerCase().includes(tech.toLowerCase())
    );
}

function calculateProfileStrength(user) {
    let score = 0;
    const maxScore = 100;
    
    // Basic info (20%)
    if (user.name) score += 10;
    if (user.portfolio?.bio) score += 10;
    
    // Portfolio completeness (60%)
    if (user.portfolio?.avatar) score += 10;
    if (user.portfolio?.skills?.length >= 3) score += 15;
    if (user.portfolio?.projects?.length >= 1) score += 20;
    if (user.portfolio?.experience?.length >= 1) score += 10;
    if (user.portfolio?.education?.length >= 1) score += 5;
    
    // Social presence (20%)
    const socialLinks = user.portfolio?.socialLinks || {};
    const filledSocialLinks = Object.values(socialLinks).filter(link => link).length;
    score += Math.min(filledSocialLinks * 5, 20);
    
    return Math.min(score, maxScore);
}

function getSkillsDistribution(skills) {
    const categories = {
        'Frontend': ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript'],
        'Backend': ['node', 'express', 'python', 'java', 'php', 'ruby'],
        'Database': ['mongodb', 'mysql', 'postgresql', 'redis'],
        'Tools': ['git', 'docker', 'aws', 'figma']
    };
    
    const distribution = {};
    
    Object.keys(categories).forEach(category => {
        distribution[category] = skills.filter(skill => 
            categories[category].some(cat => 
                skill.toLowerCase().includes(cat)
            )
        ).length;
    });
    
    return distribution;
}

function calculateActivityScore(user) {
    let score = 0;
    
    // Based on portfolio completeness and engagement
    const projectsCount = user.portfolio?.projects?.length || 0;
    const friendsCount = user.friends?.length || 0;
    const starsCount = user.stars || 0;
    
    score += Math.min(projectsCount * 10, 50);
    score += Math.min(friendsCount * 2, 30);
    score += Math.min(starsCount, 20);
    
    return Math.min(score, 100);
}

function getProjectsTimeline(projects) {
    // For timeline, we'd need createdAt dates for projects
    // This is a placeholder implementation
    return projects.map(project => ({
        title: project.title,
        date: new Date(), // Would need actual creation date
        type: 'project'
    }));
}

function getExperienceProgression(experience) {
    return experience
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .map(exp => ({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            level: determineExperienceLevel(exp.title)
        }));
}

function determineExperienceLevel(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('senior') || titleLower.includes('lead')) return 'Senior';
    if (titleLower.includes('junior') || titleLower.includes('intern')) return 'Junior';
    return 'Mid-level';
}

function getProfileRecommendations(user) {
    const recommendations = [];
    
    if (!user.portfolio?.avatar) {
        recommendations.push({
            type: 'profile_picture',
            message: 'Add a professional profile picture to increase credibility',
            priority: 'high'
        });
    }
    
    if (!user.portfolio?.bio || user.portfolio.bio.length < 50) {
        recommendations.push({
            type: 'bio',
            message: 'Write a compelling bio to tell your story',
            priority: 'high'
        });
    }
    
    if (!user.portfolio?.skills || user.portfolio.skills.length < 5) {
        recommendations.push({
            type: 'skills',
            message: 'Add more skills to showcase your expertise',
            priority: 'medium'
        });
    }
    
    if (!user.portfolio?.projects || user.portfolio.projects.length < 3) {
        recommendations.push({
            type: 'projects',
            message: 'Add more projects to demonstrate your capabilities',
            priority: 'high'
        });
    }
    
    const socialLinks = user.portfolio?.socialLinks || {};
    const filledSocialLinks = Object.values(socialLinks).filter(link => link).length;
    if (filledSocialLinks < 2) {
        recommendations.push({
            type: 'social_links',
            message: 'Connect your social profiles to expand your network',
            priority: 'medium'
        });
    }
    
    return recommendations;
}

export default {
    getStudentProfile,
    getStudentProfiles,
    getProfileAnalytics
};
