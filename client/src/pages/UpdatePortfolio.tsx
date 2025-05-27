import React, { useState, useEffect } from 'react'; // Import useEffect
import { Plus, Trash2, User, Briefcase, GraduationCap, FolderOpen, Globe, Github, Linkedin, Twitter, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import Navbar from '../components/Navbar';
import api from '../api/axios'; // Adjust the import path as necessary

export default function PortfolioForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    skills: [''],
    projects: [{
      title: '',
      description: '',
      link: '',
      imageUrl: ''
    }],
    experience: [{
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    education: [{
      degree: '',
      institution: '',
      startDate: '',
      endDate: ''
    }],
    socialLinks: {
      linkedin: '',
      github: '',
      website: '',
      twitter: ''
    }
  });

  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL for editing

  // Effect to fetch portfolio data if userId is present (for editing)
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (userId) {
        setLoading(true);
        try {
          // Use the GET route for a specific user's portfolio
          const response = await api.get(`profile/portfolio/${userId}`);
          // Set the fetched data into your form state.
          // Make sure the incoming data structure matches your formData state.
          setFormData(response.data);
        } catch (err) {
          console.error('Error fetching portfolio:', err);
          setError('Failed to load portfolio data.');
          // Optionally, navigate to a 404 page or show an error message
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPortfolio();
  }, [userId]); // Re-run when userId changes

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addArrayItem = (section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      if (userId) {
        // If userId exists, it's an update operation
        await api.put('profile/portfolio', formData);
        alert('Portfolio updated successfully!');
      } else {
        // Otherwise, it's a creation operation
        await api.post('profile/portfolio', formData);
        alert('Portfolio created successfully!');
      }
      navigate('/portfolio'); // Or navigate to the newly created/updated portfolio view
    } catch (err) {
      console.error('Error submitting portfolio:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to submit portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-center relative">
              <button
                onClick={goBack}
                className="absolute top-6 left-6 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold text-white mb-4">
                {userId ? 'Edit Your Portfolio' : 'Create Your Portfolio'}
              </h1>
              <p className="text-indigo-100 text-lg">Showcase your skills, experience, and projects</p>
            </div>

            <div className="p-8 space-y-12">
              {loading && <p className="text-center text-indigo-600">Loading...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}

              {/* Basic Information */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Avatar URL</label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </section>

              {/* Skills */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
                </div>

                <div className="space-y-4">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...formData.skills];
                          newSkills[index] = e.target.value;
                          handleInputChange('skills', newSkills);
                        }}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                        placeholder="Enter a skill"
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newSkills = formData.skills.filter((_, i) => i !== index);
                            handleInputChange('skills', newSkills);
                          }}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleInputChange('skills', [...formData.skills, ''])}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
              </section>

              {/* Projects */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FolderOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                </div>

                <div className="space-y-8">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Project {index + 1}</h3>
                        {formData.projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('projects', index)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Project title"
                        />
                        <input
                          type="url"
                          value={project.link}
                          onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Project link"
                        />
                      </div>

                      <input
                        type="url"
                        value={project.imageUrl}
                        onChange={(e) => handleArrayChange('projects', index, 'imageUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Project image URL"
                      />

                      <textarea
                        value={project.description}
                        onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Project description"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayItem('projects', { title: '', description: '', link: '', imageUrl: '' })}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
              </section>

              {/* Experience */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
                </div>

                <div className="space-y-8">
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Experience {index + 1}</h3>
                        {formData.experience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('experience', index)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Job title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Company name"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Start Date</label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">End Date (Leave empty if current)</label>
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>

                      <textarea
                        value={exp.description}
                        onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Job description and responsibilities"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayItem('experience', { title: '', company: '', startDate: '', endDate: '', description: '' })}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </div>
              </section>

              {/* Education */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <GraduationCap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                </div>

                <div className="space-y-8">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-700">Education {index + 1}</h3>
                        {formData.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('education', index)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          placeholder="Institution"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">Start Date</label>
                          <input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600">End Date</label>
                          <input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayItem('education', { degree: '', institution: '', startDate: '', endDate: '' })}
                    className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>
              </section>

              {/* Social Links */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Globe className="w-6 h-6 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Social Links</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Github className="w-4 h-4 text-gray-800" />
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.github}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Globe className="w-4 h-4 text-green-600" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.website}
                      onChange={(e) => handleSocialChange('website', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Twitter className="w-4 h-4 text-blue-400" />
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading} // Disable button while loading
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : (userId ? 'Update Portfolio' : 'Create Portfolio')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}