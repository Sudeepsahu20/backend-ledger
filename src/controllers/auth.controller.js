import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


export async function registerController(req,res) {
    try {
          const {username,email,password}=req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        })
    }

    const isExistingUser=await userModel.findOne({email});
    if(isExistingUser){
        return res.status(422).json({
            message:"user already exist with this email"
        });
    }

     const user=await userModel.create({
        username,
        email,
        password
     })

     const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
     res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    maxAge:24*60*60*1000
});


    return res.status(201).json({
        message:"User Registered successfully",
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }
    })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Errror"
        })
    }
  
}

export async function loginController(req,res){
    try {
         const {email,password}=req.body;
        
    if(!email || !password){
       return res.status(400).json({
            message:"All fields are required"
        })
    }

    const user =await userModel.findOne({email}).select("+password");;

    if(!user){
       return res.status(400).json({
            message:"User needs to register first"
        })
    }

      const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
       return res.status(400).json({message:"Invalid credentials"});
    }

      const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
     res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    maxAge:24*60*60*1000
});

return res.status(200).json({
    message:"User loggedIn successfully",
    user:{
    id:user._id,
    email:user.email,
    username:user.username
    }
})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
   

}