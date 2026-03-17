import mongoose from "mongoose";

//create a schema for the transaction model
const transactionSchema=new mongoose.Schema({
    fromAccount:{   
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:true ,
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:true,
        index:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for the transaction"],
        min:[0,"Amount must be greater than or equal to 0"]
    },
    status:{
        type:String,
        enum:["PENDING","COMPLETED","FAILED","REVERSED"],
        default:"PENDING"   
    },
    idompotencyKey:{
        type:String,
        required:[true,"Idompotency key is required for the transaction"],
        unique:true,
        index:true
    }
},{
    timestamps:true
});

export default mongoose.model("Transaction",transactionSchema);
