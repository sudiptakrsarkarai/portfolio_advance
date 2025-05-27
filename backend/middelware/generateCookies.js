import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODk3NzA0NTAsImV4cCI6MTY4OTc3NDA1MCwiaXNzIjoieW91ci1hcHAtbmFtZSJ9.9vJ6U9cZJTXNkfUetJ3_tPU3YJTRk0U3km0eI1-mW-Y';

const generateToken = (user, res = null) => {
  if (!user || !user.userId || !user.email) {
    throw new Error('Invalid user data. userId and email are required.');
  }

  // Generate the JWT
  const token = jwt.sign(
    { userId: user.userId, email: user.email },
    JWT_SECRET,
    { expiresIn: '10h' } // Token expiration time
  );

  // Optionally set the token as a cookie
  if (res) {
    res.cookie('token', token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      maxAge: 3600000, // 1 hour in milliseconds
      sameSite: 'lax', // Protect against CSRF
    });
  }

  return token; // Return the token for further usage if needed
};

export default generateToken;
