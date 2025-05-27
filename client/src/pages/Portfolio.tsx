import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import BackgroundShapes from "../components/BackgroundShapes";
import { useState, useEffect } from "react";
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
  Filter
} from "lucide-react";

const Home = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [students, setStudents] = useState([]);

  // Check for user authentication on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  // Mock student data - in real app, this would come from API
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        title: "Full Stack Developer",
        skills: ["React", "Node.js", "Python"],
        rating: 4.8,
        portfolioViews: 1240,
        projects: 12,
        friends: 89,
        status: "connected",
        lastActive: "2 hours ago",
        bio: "Passionate about creating seamless user experiences and scalable applications."
      },
      {
        id: 2,
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        title: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "Prototyping"],
        rating: 4.9,
        portfolioViews: 2150,
        projects: 18,
        friends: 156,
        status: "friend",
        lastActive: "1 hour ago",
        bio: "Design enthusiast focused on human-centered design solutions."
      },
      {
        id: 3,
        name: "Marcus Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        title: "Data Scientist",
        skills: ["Python", "Machine Learning", "Analytics"],
        rating: 4.7,
        portfolioViews: 890,
        projects: 8,
        friends: 67,
        status: "pending",
        lastActive: "5 hours ago",
        bio: "Turning data into actionable insights and predictive models."
      },
      {
        id: 4,
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        title: "Mobile Developer",
        skills: ["React Native", "Flutter", "iOS"],
        rating: 4.6,
        portfolioViews: 1560,
        projects: 15,
        friends: 123,
        status: "stranger",
        lastActive: "3 hours ago",
        bio: "Building beautiful mobile experiences that users love."
      },
      {
        id: 5,
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        title: "DevOps Engineer",
        skills: ["AWS", "Docker", "Kubernetes"],
        rating: 4.5,
        portfolioViews: 780,
        projects: 10,
        friends: 45,
        status: "connected",
        lastActive: "30 minutes ago",
        bio: "Streamlining development workflows and cloud infrastructure."
      },
      {
        id: 6,
        name: "Lisa Park",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        title: "Frontend Developer",
        skills: ["Vue.js", "TypeScript", "CSS"],
        rating: 4.8,
        portfolioViews: 1890,
        projects: 20,
        friends: 134,
        status: "friend",
        lastActive: "1 day ago",
        bio: "Crafting pixel-perfect interfaces with modern web technologies."
      }
    ];
    setStudents(mockStudents);
  }, []);

  const handleSendRequest = (studentId) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, status: "pending" }
        : student
    ));
  };

  const handleGiveStars = (studentId, stars) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId
        ? { ...student, rating: ((student.rating * 10 + stars) / 11).toFixed(1) }
        : student
    ));
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterBy === "all") return matchesSearch;
    if (filterBy === "friends") return matchesSearch && student.status === "friend";
    if (filterBy === "connected") return matchesSearch && student.status === "connected";
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "friend":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Friend</span>;
      case "connected":
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
                    <option value="friends">Friends</option>
                    <option value="connected">Connected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === "friend").length}</p>
                  <p className="text-sm text-gray-600">Friends</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === "connected").length}</p>
                  <p className="text-sm text-gray-600">Connected</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{students.reduce((acc, s) => acc + s.projects, 0)}</p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Profile Header */}
                <div className="relative">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div className="absolute -bottom-6 left-6">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
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
                      <p className="text-lg font-semibent text-gray-900">{student.portfolioViews}</p>
                      <p className="text-xs text-gray-600">Views</p>
                    </div>
                  </div>

                  {/* Last Active */}
                  <p className="text-xs text-gray-500 mb-4">Active {student.lastActive}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Updated Link to /view/:id */}
                    <Link to={`/view/${student.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Portfolio
                      </Button>
                    </Link>

                    {student.status === "stranger" && (
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(student.id)}
                        className="flex-shrink-0"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    )}

                    {(student.status === "friend" || student.status === "connected") && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleGiveStars(student.id, star)}
                            className="text-gray-300 hover:text-yellow-500 transition-colors"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;