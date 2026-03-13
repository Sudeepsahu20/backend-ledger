import userModel from "../models/user.model.js";

async function authMiddleware(req,res,next){    
    try {
        const token=req.cookies.token;  
        if(!token){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const decoded=jwt.verify(token,process.env.SECRET_KEY); 
        const user=await userModel.findById(decoded.id)
        if(!user){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }   
        req.user=user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message:"Unauthorized"
        })
    }   
}

export default authMiddleware;