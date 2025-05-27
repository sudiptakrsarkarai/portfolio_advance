import mongoose from 'mongoose';


const mongoURI = 'mongodb+srv://sudiptakumarsarkaradtu:ojJNq84nlxrraWrD@cluster0.ril8mgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  


const connectDB = async () => {
  try {
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  
  }
};


export default connectDB;
