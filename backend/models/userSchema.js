// models/User.js
import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';

// Embedded schema for portfolio details
const portfolioSchema = new Schema({
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' }, // URL to profile picture
  skills: [{ type: String }], // Array of skills
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    imageUrl: { type: String },
  }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // Can be null for current job
    description: { type: String },
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  }],
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  resumeUrl: { type: String, default: '' },
}, { _id: false }); // No separate _id for the embedded portfolio

const userSchema = new Schema({
  // --- Core Authentication ---
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't return password by default on queries
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  // --- Basic Personal Details ---
  dateOfBirth: { type: Date },
  phone: { type: String, trim: true },

  // --- Portfolio Details ---
  portfolio: {
    type: portfolioSchema,
    default: () => ({}), // Default to an empty object
  },

  // --- Social Features ---
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User' ,// Reference to other users
    default:0
  }],
  stars: {
    type: Number,
    default: 0 // Number of stars/likes received
  },

  // --- Timestamps ---
}, { timestamps: true });

// --- Mongoose Hooks (Middleware) ---

// Hash the password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await hash(this.password, 12); // Using a salt round of 12
    next();
  } catch (error) {
    next(error);
  }
});

// --- Mongoose Instance Methods ---

// Compare provided password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // 'this.password' won't be available here if 'select: false' is used
  // We need to explicitly fetch it or handle it.
  // A better approach is to fetch the user *with* the password when logging in.
  // However, for this example, we'll assume we can re-fetch or that it's selected.
  // For a real app, ensure you select the password field for comparison.
  // We'll proceed *as if* it's available for demonstration.
  // To make this work, you'd query like: User.findOne({ email }).select('+password');
  // For now, this will likely fail unless the password was explicitly selected.
  // Let's adjust the schema to *not* select: false for demonstration,
  // but be mindful of this in production. For now, let's keep `select: false`
  // and note that the comparison must happen where password is selected.
  // For *this* method, we need the password. A common pattern is:
  const user = await this.constructor.findById(this._id).select('+password').exec();
  if (!user) {
      throw new Error('User not found during password comparison.');
  }
  return compare(candidatePassword, user.password);
};


export default model('User', userSchema);