import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = 8080;

connectDB();

app.listen(PORT,()=>{
  console.log("Server is lostening to port 8080");
})
