import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import BackgroundShapes from "../components/BackgroundShapes";
import { useState, useEffect, useCallback } from "react";
import {
  User,
  Star,
  UserPlus,
  Eye,
  MessageCircle,
  Heart,
  Award,
  Users,
  Search,
  Filter,
  RefreshCcw,
} from "lucide-react";
import api from "../api/axios.js"; // Your configured axios instance

const Home = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all"); // 'all', 'friends', 'connected'
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalStars: 0,
    totalProjects: 0,
    totalSkills: 0,
  });

  // Check for user authentication on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default auth header
        } catch (error) {
          console.error('Error parsing user data or setting auth token:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      } else {
        setUser(null);
        delete api.defaults.headers.common['Authorization']; // Clear auth header if no token
      }
    };

    checkAuthStatus();
  }, []);

  // Function to fetch student profiles and platform stats
  const fetchStudentsAndStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch students with search and filter parameters
      const studentParams = {
        search: searchTerm,
        filterBy: filterBy, // Pass filterBy to backend
      };

      // Only include filterBy if the user is logged in for 'friends' or 'connected'
      if (!user && (filterBy === "friends" || filterBy === "connected")) {
        // If not logged in, revert filter to 'all' or show a message
        console.warn("Cannot filter by friends/connected without being logged in.");
        setFilterBy("all"); // Revert filter to 'all' if user is not logged in
        return; // Exit early
      }

      const studentsResponse = await api.get('profile/profiles', { params: studentParams });
      const fetchedStudents = studentsResponse.data.data;

      // Map backend data to frontend structure with robust property access
      const formattedStudents = fetchedStudents.map(s => {
        // Essential checks for a valid student profile
        if (!s.id || typeof s.name !== 'string' || s.name.trim() === '') {
          console.warn("Skipping malformed student data (missing id or valid name):", s);
          return null;
        }

        // Determine status based on logged-in user's friends list
        // Assuming user.friends is an array of friend IDs
        const isFriend = user && user.friends && user.friends.includes(s.id);
        const status = isFriend ? "friend" : "stranger"; // You might need a more complex "connected" logic if different from "friend"

        return {
          id: s.id,
          name: s.name,
          avatar: s.avatar || '/default-avatar.png', // Backend provides 'avatar' directly
          title: s.title || 'No title available', // Backend provides 'title' directly
          skills: s.skills || [], // Backend provides 'skills' directly
          bio: s.bio || 'No bio available', // Backend provides 'bio' directly
          projects: s.stats?.projects || 0, // Access from 'stats' object
          friends: s.stats?.friends || 0, // Access from 'stats' object
          rating: s.stats?.stars || 0, // Access from 'stats' object, backend sends 'stars'
          portfolioViews: s.portfolioViews || 0, // If backend adds this, otherwise default 0
          memberSince: s.memberSince, // Backend provides 'memberSince' directly
          status: status,
        };
      }).filter(Boolean); // Filter out any null entries

      setStudents(formattedStudents);

      // Fetch platform statistics
      const statsResponse = await api.get('profile/stats/platform');
      setPlatformStats({
        totalUsers: statsResponse.data.data.platform?.totalUsers || 0,
        totalStars: statsResponse.data.data.platform?.totalStars || 0,
        totalProjects: statsResponse.data.data.platform?.totalProjects || 0,
        totalSkills: statsResponse.data.data.platform?.totalSkills || 0,
      });

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterBy, user]); // Depend on searchTerm, filterBy, and user for re-fetching

  useEffect(() => {
    fetchStudentsAndStats();
  }, [fetchStudentsAndStats]); // Call fetch function when dependencies change

  const handleSendRequest = async (studentId) => {
    if (!user) {
      alert("Please log in to connect with students.");
      return;
    }
    if (!studentId) {
      console.error("Cannot send connection request: studentId is undefined or null.");
      alert("Error: Student ID is missing. Please try again.");
      return;
    }
    try {
      // Optimistic update
      setStudents(prev => prev.map(student =>
        student.id === studentId
          ? { ...student, status: "pending" }
          : student
      ));
      await api.post(`profile/profile/${studentId}/connect`);
      alert("Connection request sent!");
      // Re-fetch students to get updated status from backend
      fetchStudentsAndStats();
    } catch (err) {
      console.error("Error sending connection request:", err);
      setError("Failed to send connection request.");
      // Revert optimistic update on error
      setStudents(prev => prev.map(student =>
        student.id === studentId
          ? { ...student, status: "stranger" } // Revert to stranger or original status
          : student
      ));
    }
  };

  const handleStarProfile = async (studentId) => {
    if (!user) {
      alert("Please log in to star profiles.");
      return;
    }
    if (!studentId) {
      console.error("Cannot star profile: studentId is undefined or null.");
      alert("Error: Student ID is missing. Please try again.");
      return;
    }
    try {
      // Optimistic update (adjusting rating based on a conceptual 'star' action, actual rating might differ)
      setStudents(prev => prev.map(student =>
        student.id === studentId
          ? { ...student, rating: student.rating + 1 } // Increment rating by 1 for a star
          : student
      ));
      await api.post(`profile/profile/${studentId}/star`);
      alert("Profile starred!");
      fetchStudentsAndStats(); // Re-fetch to get accurate star count
    } catch (err) {
      console.error("Error starring profile:", err);
      setError("Failed to star profile.");
      // Revert optimistic update on error
      setStudents(prev => prev.map(student =>
        student.id === studentId
          ? { ...student, rating: student.rating - 1 } // Revert rating
          : student
      ));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "friend":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Friend</span>;
      case "connected": // You might define "connected" differently if it's not just "friend"
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Connected</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Stranger</span>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <BackgroundShapes />

        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-3xl w-full px-4 py-16 text-center relative z-10">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-portfolio-blue to-portfolio-purple">
              Welcome to Portfolio Duo
            </h1>

            <p className="text-xl mb-8 text-gray-700">
              Connect with talented students and explore amazing portfolios
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Login to Connect
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <BackgroundShapes />

      <main className="flex-grow relative z-10">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Network</h1>
                <p className="text-gray-600 mt-1">Discover and connect with talented students</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <Link to="/portfolio-create"> Create Portfolio</Link>
              </button>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students, skills..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value="all">All Students</option>
                    {user && <option value="friends">Friends</option>}
                    {user && <option value="connected">Connected</option>}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          {loading && <div className="text-center py-4">Loading students and statistics...</div>}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{platformStats.totalUsers}</p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <Heart className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {user ? students.filter(s => s.status === "friend").length : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Your Friends</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <MessageCircle className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {user ? students.filter(s => s.status === "connected").length : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Your Connections</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{platformStats.totalProjects}</p>
                    <p className="text-sm text-gray-600">Total Projects</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Grid */}
          {!loading && students.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  {/* Profile Header */}
                  <div className="relative">
                    <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <div className="absolute -bottom-6 left-6">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full border-4 border-white shadow-sm object-cover"
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(student.status)}
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="pt-8 pb-6 px-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.title}</p>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{student.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{student.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {student.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                          {skill}
                        </span>
                      ))}
                      {/* Show a "+X more" if there are more skills */}
                      {student.skills.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                          +{student.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{student.projects}</p>
                        <p className="text-xs text-gray-600">Projects</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{student.friends}</p>
                        <p className="text-xs text-gray-600">Friends</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{student.portfolioViews}</p>
                        <p className="text-xs text-gray-600">Views</p>
                      </div>
                    </div>

                    {/* Last Active */}
                    <p className="text-xs text-gray-500 mb-4">
                        Active {student.memberSince ? new Date(student.memberSince).toLocaleDateString() : "N/A"}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link to={`/view/${student.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Portfolio
                        </Button>
                      </Link>

                      {user && student.status === "stranger" && (
                        <Button
                          size="sm"
                          onClick={() => handleSendRequest(student.id)}
                          className="flex-shrink-0"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      )}

                      {user && (student.status === "friend" || student.status === "connected") && (
                        <Button
                          size="sm"
                          onClick={() => handleStarProfile(student.id)}
                          className="flex-shrink-0 text-yellow-500 hover:text-yellow-600"
                          variant="outline"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && students.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              <Button onClick={fetchStudentsAndStats} className="mt-4">
                <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;