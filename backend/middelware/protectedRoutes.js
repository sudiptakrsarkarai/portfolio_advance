import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODk3NzA0NTAsImV4cCI6MTY4OTc3NDA1MCwiaXNzIjoieW91ci1hcHAtbmFtZSJ9.9vJ6U9cZJTXNkfUetJ3_tPU3YJTRk0U3km0eI1-mW-Y'; // Your JWT secret key

// Middleware to verify JWT token from cookies
export const verifyToken = (req, res, next) => {


  
  
  // Get token from cookies
  const token = req.cookies.token;


  if (!token) {
    return res.status(403).json({ message: 'unauthonticated' });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
