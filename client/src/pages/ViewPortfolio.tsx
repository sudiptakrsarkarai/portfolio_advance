import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BackgroundShapes from "../components/BackgroundShapes";
import { Star, Award, Users, Eye, MessageCircle, ArrowLeft, Link } from "lucide-react"; // Added Link for generic website icon
import { Button } from "@/components/ui/button";
import api from "../api/axios.js"; // Import your API client

const ViewPortfolio = () => {
  const { id } = useParams(); // Get the student ID from the URL (which should be the userId)
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // To get logged-in user's data

  // Function to get the logged-in user's data (if any) to determine connection status
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // Clear invalid data if parsing fails
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const fetchStudentPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`profile/profile/${id}`);
      const fetchedData = response.data.data; // Backend sends data in { success: true, data: { ... } } format

      if (fetchedData) {
        // Ensure avatar path is correct, use default if not provided
        const avatarUrl = fetchedData.avatar || '/default-avatar.png';

        // Correctly map backend data to frontend state
        setStudent({
          id: fetchedData.id,
          name: fetchedData.name,
          avatar: avatarUrl,
          title: fetchedData.title || "Student",
          skills: fetchedData.skills || [],
          rating: fetchedData.stats?.stars || 0, // Using 'stars' from stats
          portfolioViews: fetchedData.stats?.views || 0, // Using 'views' from stats
          projects: fetchedData.stats?.projects || 0, // Using 'projects' from stats
          friends: fetchedData.stats?.friends || 0, // Using 'friends' from stats
          
          // Determine status based on current user's friends list
          status: currentUser && currentUser.friends && currentUser.friends.includes(fetchedData.id) ? "friend" : "stranger",
          
          lastActive: fetchedData.lastActive || "N/A",
          bio: fetchedData.bio || "No bio available.",

          experience: fetchedData.experience || [],
          education: fetchedData.education || [],
          recentProjects: fetchedData.projects || [], // This is the detailed projects array
          contact: {
            email: fetchedData.email || '',
            linkedin: fetchedData.socialLinks?.linkedin || '',
            github: fetchedData.socialLinks?.github || '',
            website: fetchedData.socialLinks?.website || '',
            twitter: fetchedData.socialLinks?.twitter || '',
          },
          resumeUrl: fetchedData.contactInfo?.resumeUrl || '',
          isOnline: fetchedData.isOnline, // Use the isOnline flag from backend
        });
      } else {
        setError("Student not found.");
      }
    } catch (err) {
      console.error("Error fetching student portfolio:", err);
      if (err.response && err.response.status === 404) {
        setError("Portfolio not found.");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Display specific error message from backend
      } else {
        setError("Failed to load portfolio. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]); // Re-run if ID or currentUser changes

  useEffect(() => {
    fetchStudentPortfolio();
  }, [fetchStudentPortfolio]); // Dependency array for useEffect

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading student portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50 p-4">
        <p className="text-lg text-red-600 font-semibold text-center">{error}</p>
        <Button onClick={() => navigate(-1)} className="mt-6 px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors duration-200">Go Back</Button>
      </div>
    );
  }

  if (!student) {
    return null; // Should not happen if loading/error states are handled, but good for safety
  }

  const getStatusBadge = (status, isOnline) => {
    let badgeText = '';
    let badgeClasses = '';

    if (isOnline) {
      badgeText = 'Online';
      badgeClasses = 'bg-green-100 text-green-800';
    } else {
      switch (status) {
        case "friend":
          badgeText = "Friend";
          badgeClasses = "bg-blue-100 text-blue-800"; // Changed to blue for "friend" if offline
          break;
        case "connected":
          badgeText = "Connected";
          badgeClasses = "bg-blue-100 text-blue-800";
          break;
        case "pending":
          badgeText = "Pending";
          badgeClasses = "bg-yellow-100 text-yellow-800";
          break;
        default:
          badgeText = "Stranger";
          badgeClasses = "bg-gray-100 text-gray-800";
      }
    }
    
    return (
      <span className={`${badgeClasses} px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
        {isOnline && <span className="relative flex h-2 w-2 mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>}
        {badgeText}
      </span>
    );
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date strings
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <BackgroundShapes />

      <main className="flex-grow relative z-10 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Back Button */}
            <div className="absolute top-4 left-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full bg-white/70 backdrop-blur-sm hover:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </Button>
            </div>

            {/* Cover Photo / Header */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
                <h1 className="text-white text-4xl font-bold drop-shadow-md">{student.name}'s Portfolio</h1>
              </div>
              <div className="absolute -bottom-16 left-8">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
            </div>

            {/* Profile Details */}
            <div className="pt-20 pb-8 px-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{student.name}</h2>
                  <p className="text-lg text-gray-700">{student.title}</p>
                  <div className="mt-2">{getStatusBadge(student.status, student.isOnline)}</div>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="ml-2 text-xl font-semibold text-gray-800">{parseFloat(student.rating).toFixed(1)}</span>
                </div>
              </div>

              <p className="text-gray-600 mt-4 text-base leading-relaxed">
                {student.bio}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-center">
                <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm">
                  <Award className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.projects}</p>
                  <p className="text-sm text-gray-600">Projects Completed</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm">
                  <Users className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.friends}</p>
                  <p className="text-sm text-gray-600">Connections</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center justify-center shadow-sm">
                  <Eye className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.portfolioViews}</p>
                  <p className="text-sm text-gray-600">Portfolio Views</p>
                </div>
              </div>

              {/* Skills Section */}
              {student.skills && student.skills.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {student.experience && student.experience.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience</h3>
                  <div className="space-y-4">
                    {student.experience.map((exp, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-semibold text-gray-900">{exp.title} at {exp.company}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {student.education && student.education.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
                  <div className="space-y-4">
                    {student.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-semibold text-gray-900">{edu.degree} from {edu.institution}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Projects Section */}
              {student.recentProjects && student.recentProjects.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {student.recentProjects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                        <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
                        {project.imageUrl && (
                          <img src={project.imageUrl} alt={project.title} className="mt-4 rounded-lg w-full h-auto object-cover max-h-48 border border-gray-200" />
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-4 inline-flex items-center">
                            <Link className="w-4 h-4 mr-1" /> View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact & Links</h3>
                <div className="flex flex-wrap gap-4">
                  {student.contact.email && (
                    <a href={`mailto:${student.contact.email}`} className="flex items-center text-blue-600 hover:underline">
                      <MessageCircle className="w-5 h-5 mr-2" /> Email
                    </a>
                  )}
                  {student.contact.linkedin && (
                    <a href={student.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg" className="w-5 h-5 mr-2" alt="LinkedIn" /> LinkedIn
                    </a>
                  )}
                  {student.contact.github && (
                    <a href={student.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg" className="w-5 h-5 mr-2" alt="GitHub" /> GitHub
                    </a>
                  )}
                  {student.contact.website && (
                    <a href={student.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <Link className="w-5 h-5 mr-2" /> Website
                    </a>
                  )}
                  {student.contact.twitter && (
                    <a href={student.contact.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/twitter.svg" className="w-5 h-5 mr-2" alt="Twitter" /> Twitter
                    </a>
                  )}
                </div>
              </div>

              {student.resumeUrl && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Resume</h3>
                  <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors duration-200">Download Resume</Button>
                  </a>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-gray-200 text-right text-sm text-gray-500">
                Last active: {student.lastActive}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewPortfolio;