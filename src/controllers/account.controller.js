
import accountModel from "../models/account.model.js";      


export async function createAccountController(req,res){
    try {
        const {accountName,accountType,balance}=req.body;
        if(!accountName || !accountType || !balance){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
        const account=await accountModel.create({
            accountName,
            accountType,
            balance,
            userId:req.user.id
        })  
        return res.status(201).json({
            message:"Account created successfully",
            account
        })
    } catch (error) {
        return res.status(500).json({
            message:"Error creating account",
            error:error.message
        })
    }
}

