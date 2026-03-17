//create a controller for transaction having user credentailas from authMiddleware in req.user.id and create a new transaction for the user and return the transaction details in response
import transactionModel from "../models/transaction.model.js";  
import accountModel from "../models/account.model.js";

export async function createTransactionController(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body;
    if(!fromAccount || !toAccount || !amount|| !idempotencyKey){
        return res.status(400).json({
            message:"From account, to account, amount and idempotency key are required for the transaction"
        })
    }

    const fromUserAccount=await accountModel.findOne({_id:fromAccount});
    if(!fromUserAccount){
        return res.status(404).json({
            message:"From account not found for the user"
        })
    }


     const toUserAccount=await accountModel.findOne({_id:toAccount});
     if(!toUserAccount){
        return res.status(404).json({
            message:"To account not found for the user"
        })
     }


 const isTransactionExist=await transactionModel.findOne({idempotencyKey:idempotencyKey});
 if(isTransactionExist){
   if(isTransactionExist.status===COMPLETED){
    return res.status(200).json({
        message:"Transaction already exists and is completed",
        transaction:isTransactionExist
    })
   }{
 }
 if(isTransactionExist.status===PENDING){
    return res.status(200).json({
        message:"Transaction already exists and is pending",
        transaction:isTransactionExist
    })
  }

  if(isTransactionExist.status===FAILED){
    return res.status(200).json({
        message:"Transaction already exists and is failed",
        transaction:isTransactionExist
    })
  }
}
if(isTransactionExist.status===REVERSED){   
    return res.status(200).json({
        message:"Transaction already exists and is reversed pleasse try again with a different idempotency key",
    })
 
}

if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
    return res.status(400).json({
        message:"One or both accounts are not active for the transaction"
    })

}

}