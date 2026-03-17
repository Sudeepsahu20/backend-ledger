
import accountModel from "../models/account.model.js";      

//create a controller for account having user credentailas from authMiddleware in req.user.id and create a new account for the user and return the account details in response

export async function createAccountController(req,res){
    const user=req.user;

    try {
        const account=await accountModel.create({
            user:user._id
        });
        return res.status(201).json({
            message:"Account created successfully",
            account
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

