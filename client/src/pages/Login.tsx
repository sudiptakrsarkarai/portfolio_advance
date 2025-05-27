import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import BackgroundShapes from "../components/BackgroundShapes";
import { Eye, EyeOff, Mail, Lock, Sparkles, ChevronRight, User } from "lucide-react";
import api from "../api/axios.js";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearError = () => {
    setError("");
  };

  // Handle successful login by storing auth data
  const handleLoginSuccess = (userData, token) => {
    // Store authentication data in localStorage
    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // Set authorization header for future API requests
    if (token && api.defaults) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('user/login', {
        email,
        password,
      });

      console.log("Login success", response.data);
      
      // Extract token and user data from response
      const { token, user, data } = response.data;
      
      // Handle different response structures
      const authToken = token || data?.token;
      const userData = user || data?.user || { email };
      
      // Handle successful login
      handleLoginSuccess(userData, authToken);
      
      toast({ 
        title: "Login successful", 
        description: "Welcome back!" 
      });
      
      // Navigate to intended page or portfolio
      const from = location.state?.from?.pathname || "/portfolio";
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error("Login failed", err);
      
      // Extract error message from response
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: "user1@example.com", password: "password123", label: "Creative Portfolio" },
    { email: "user2@example.com", password: "password123", label: "Business Portfolio" }
  ];

  const fillDemoCredentials = (index) => {
    setEmail(demoAccounts[index].email);
    setPassword(demoAccounts[index].password);
    clearError();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundShapes />

      <div className="flex-grow relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 p-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Brand
            </div>
            <div className="text-white/60 hover:text-white transition-colors cursor-pointer">
              Need help?
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-64px)] relative z-10">
          <div className={`w-full max-w-md transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 rounded-3xl"></div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-75 blur-sm animate-pulse"></div>
              <div className="absolute inset-[1px] rounded-3xl bg-slate-900/90 backdrop-blur-xl"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-gray-400">Enter your credentials to continue</p>
                </div>

                {/* Error */}
                {error && (
                  <Alert className="mb-6 bg-red-500/20 border-red-500/30 text-red-300">
                    <AlertDescription className="animate-shake">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm"
                        placeholder="your@email.com"
                        required
                        disabled={loading}
                      />
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${focusedField === 'email' ? 'opacity-100' : ''}`}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 backdrop-blur-sm"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${focusedField === 'password' ? 'opacity-100' : ''}`}></div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Logging in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </div>
                  </Button>
                </form>

                {/* Demo Accounts */}
                <div className="mt-8">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-400">Try demo accounts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {demoAccounts.map((account, index) => (
                      <button
                        key={index}
                        onClick={() => fillDemoCredentials(index)}
                        disabled={loading}
                        className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl p-3 text-sm text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {account.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sign Up */}
                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className={`text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors duration-200 ${loading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;