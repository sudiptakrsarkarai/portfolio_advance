import express from 'express';
import cors from 'cors'; // Import CORS middleware
import { config } from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js';
import connectionDB from './config/db.js';

config();
const app = express();
// const __dirname=path.resolve()
app.use(
  cors({
    origin:["http://localhost:8080"] ,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api',(req,res)=>{
 res.send('server running ')
})


app.use('/api/user', authRoutes);
app.use('/api/profile', profileRoutes);



// app.use(express.static(path.join(__dirname,"/frontend/dist")));

// app.get('*',(req,res)=>{
//   res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'))
// })

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectionDB();
  console.log(`Server running on port ${PORT}`);
});