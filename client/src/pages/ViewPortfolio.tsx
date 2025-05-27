import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../components/Navbar";
import BackgroundShapes from "../components/BackgroundShapes";
import { Star, Award, Users, Eye, MessageCircle, ArrowLeft } from "lucide-react"; // Import ArrowLeft
import { Button } from "@/components/ui/button";

const ViewPortfolio = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would fetch student data from an API
    // based on the 'id' parameter.
    // For this example, we'll use the same mock data as the Home page.
    const mockStudents = [
      {
        id: 1,
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        title: "Full Stack Developer",
        skills: ["React", "Node.js", "Python", "MongoDB", "Express.js", "GraphQL"],
        rating: 4.8,
        portfolioViews: 1240,
        projects: 12,
        friends: 89,
        status: "connected",
        lastActive: "2 hours ago",
        bio: "Passionate about creating seamless user experiences and scalable applications. I thrive on building robust backend systems and intuitive frontend interfaces. Always eager to learn new technologies and collaborate on innovative projects.",
        contact: {
          email: "alex.chen@example.com",
          linkedin: "https://www.linkedin.com/in/alexchen",
          github: "https://github.com/alexchen",
          website: "https://alexchen.dev"
        },
        recentProjects: [
          { title: "E-commerce Platform", description: "Built a full-stack e-commerce site with user authentication, product listings, and payment integration.", technologies: ["React", "Node.js", "Stripe"] },
          { title: "Real-time Chat App", description: "Developed a real-time chat application using WebSockets for instant messaging.", technologies: ["React", "Socket.io", "Express.js"] },
          { title: "Data Visualization Dashboard", description: "Created an interactive dashboard to visualize complex datasets.", technologies: ["Python", "D3.js", "Flask"] }
        ]
      },
      {
        id: 2,
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        title: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Usability Testing"],
        rating: 4.9,
        portfolioViews: 2150,
        projects: 18,
        friends: 156,
        status: "friend",
        lastActive: "1 hour ago",
        bio: "Design enthusiast focused on human-centered design solutions. I specialize in creating intuitive and aesthetically pleasing interfaces that enhance user engagement. My process involves thorough research, iterative design, and continuous feedback.",
        contact: {
          email: "sarah.j@example.com",
          linkedin: "https://www.linkedin.com/in/sarahjohnson",
          behance: "https://www.behance.net/sarahjdesign"
        },
        recentProjects: [
          { title: "Mobile App Redesign", description: "Led the redesign of a popular productivity mobile application, improving user flow and visual appeal.", technologies: ["Figma", "User Research"] },
          { title: "Website UI Kit", description: "Developed a comprehensive UI kit for a new corporate website, ensuring consistency across all pages.", technologies: ["Adobe XD", "Style Guides"] },
          { title: "Interactive Prototype", description: "Created a high-fidelity interactive prototype for a smart home system.", technologies: ["Figma", "Prototyping"] }
        ]
      },
      {
        id: 3,
        name: "Marcus Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        title: "Data Scientist",
        skills: ["Python", "Machine Learning", "Analytics", "SQL", "TensorFlow", "Pandas"],
        rating: 4.7,
        portfolioViews: 890,
        projects: 8,
        friends: 67,
        status: "pending",
        lastActive: "5 hours ago",
        bio: "Turning data into actionable insights and predictive models. I have a strong background in statistical analysis, machine learning, and data visualization. My goal is to extract meaningful patterns from complex datasets to drive informed decisions.",
        contact: {
          email: "marcus.r@example.com",
          linkedin: "https://www.linkedin.com/in/marcusrodriguez",
          github: "https://github.com/marcusr"
        },
        recentProjects: [
          { title: "Customer Churn Prediction", description: "Built a machine learning model to predict customer churn for a telecom company.", technologies: ["Python", "Scikit-learn"] },
          { title: "Sales Forecasting Model", description: "Developed a time-series forecasting model to predict future sales trends.", technologies: ["Python", "Prophet"] },
          { title: "Sentiment Analysis of Reviews", description: "Performed sentiment analysis on customer reviews to identify key product strengths and weaknesses.", technologies: ["Python", "NLTK"] }
        ]
      },
      {
        id: 4,
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        title: "Mobile Developer",
        skills: ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin"],
        rating: 4.6,
        portfolioViews: 1560,
        projects: 15,
        friends: 123,
        status: "stranger",
        lastActive: "3 hours ago",
        bio: "Building beautiful mobile experiences that users love. I have experience developing cross-platform applications and native iOS/Android apps. My focus is on performance, user experience, and clean code architecture.",
        contact: {
          email: "emma.t@example.com",
          linkedin: "https://www.linkedin.com/in/emmathompson",
          github: "https://github.com/emmat"
        },
        recentProjects: [
          { title: "Fitness Tracking App", description: "Developed a cross-platform fitness tracking application with GPS integration and real-time data.", technologies: ["React Native", "Firebase"] },
          { title: "Recipe Finder App", description: "Created an iOS recipe application with search, save, and ingredient-based filtering.", technologies: ["Swift", "Core Data"] },
          { title: "E-wallet Application", description: "Built a secure mobile e-wallet application with transaction history and QR code payments.", technologies: ["Flutter", "Node.js"] }
        ]
      },
      {
        id: 5,
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        title: "DevOps Engineer",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Ansible"],
        rating: 4.5,
        portfolioViews: 780,
        projects: 10,
        friends: 45,
        status: "connected",
        lastActive: "30 minutes ago",
        bio: "Streamlining development workflows and cloud infrastructure. I specialize in automating deployments, managing scalable systems, and ensuring reliable operations. Passionate about infrastructure as code and site reliability.",
        contact: {
          email: "david.k@example.com",
          linkedin: "https://www.linkedin.com/in/davidkimdevops",
          github: "https://github.com/davidk"
        },
        recentProjects: [
          { title: "Automated CI/CD Pipeline", description: "Implemented a fully automated CI/CD pipeline for a microservices application.", technologies: ["Jenkins", "Docker", "Kubernetes"] },
          { title: "Cloud Infrastructure Setup", description: "Designed and deployed scalable cloud infrastructure on AWS using Infrastructure as Code.", technologies: ["AWS", "Terraform"] },
          { title: "Containerized Application Deployment", description: "Migrated legacy applications to containerized environments for improved portability and scalability.", technologies: ["Docker", "Kubernetes"] }
        ]
      },
      {
        id: 6,
        name: "Lisa Park",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        title: "Frontend Developer",
        skills: ["Vue.js", "TypeScript", "CSS", "Tailwind CSS", "Sass", "Webpack"],
        rating: 4.8,
        portfolioViews: 1890,
        projects: 20,
        friends: 134,
        status: "friend",
        lastActive: "1 day ago",
        bio: "Crafting pixel-perfect interfaces with modern web technologies. I have a keen eye for detail and a passion for creating engaging and responsive user experiences. Expertise in various frontend frameworks and build tools.",
        contact: {
          email: "lisa.p@example.com",
          linkedin: "https://www.linkedin.com/in/lisaparkfrontend",
          github: "https://github.com/lisap"
        },
        recentProjects: [
          { title: "Component Library Development", description: "Built a reusable component library for a large-scale web application.", technologies: ["Vue.js", "Storybook", "TypeScript"] },
          { title: "Responsive Marketing Site", description: "Developed a fully responsive marketing website with animations and interactive elements.", technologies: ["Vue.js", "Tailwind CSS"] },
          { title: "Dashboard UI Implementation", description: "Implemented complex data visualization dashboards based on design mockups.", technologies: ["Vue.js", "Chart.js", "Sass"] }
        ]
      }
    ];

    const foundStudent = mockStudents.find((s) => s.id === parseInt(id));

    if (foundStudent) {
      setStudent(foundStudent);
    } else {
      setError("Student not found.");
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading student portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!student) {
    return null; // Should not happen if loading/error are handled, but as a fallback
  }

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
                {/* You can add a cover photo here if available in student data */}
                <h1 className="text-white text-4xl font-bold">{student.name}'s Portfolio</h1>
              </div>
              <div className="absolute -bottom-16 left-8">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                />
              </div>
            </div>

            {/* Profile Details */}
            <div className="pt-20 pb-8 px-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{student.name}</h2>
                  <p className="text-lg text-gray-700">{student.title}</p>
                  <div className="mt-2">{getStatusBadge(student.status)}</div>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="ml-2 text-xl font-semibold text-gray-800">{student.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mt-4 text-base leading-relaxed">
                {student.bio}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-center">
                <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <Award className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.projects}</p>
                  <p className="text-sm text-gray-600">Projects Completed</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <Users className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.friends}</p>
                  <p className="text-sm text-gray-600">Connections</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center justify-center">
                  <Eye className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{student.portfolioViews}</p>
                  <p className="text-sm text-gray-600">Portfolio Views</p>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Projects Section */}
              {student.recentProjects && student.recentProjects.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {student.recentProjects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                        <p className="text-gray-600 mt-2 text-sm">{project.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
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
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg" className="w-5 h-5 mr-2 invert" alt="LinkedIn" /> LinkedIn
                    </a>
                  )}
                  {student.contact.github && (
                    <a href={student.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg" className="w-5 h-5 mr-2 invert" alt="GitHub" /> GitHub
                    </a>
                  )}
                  {student.contact.website && (
                    <a href={student.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <Eye className="w-5 h-5 mr-2" /> Website
                    </a>
                  )}
                  {student.contact.behance && (
                    <a href={student.contact.behance} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/behance.svg" className="w-5 h-5 mr-2 invert" alt="Behance" /> Behance
                    </a>
                  )}
                </div>
              </div>

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