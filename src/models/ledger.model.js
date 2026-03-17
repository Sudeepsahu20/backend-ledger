//create a ledger model with the following fields: transactionId, fromAccount, toAccount, amount, status, idompotencyKey
import mongoose from "mongoose";
const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Amount is required for the ledger entry"],
        index:true,
        immutable:true
    },
  amount:{
    type:Number,
    required:[true,"Amount is required for the ledger entry"],
    immutable:true
  },
  transaction:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Transaction",
    required:[true,"Transaction is required for the ledger entry"],
    index:true,
    immutable:true
  },
  type:{
    type:String,
    enum:{
        values:["DEBIT","CREDIT"],
        message:"Transaction type must be either DEBIT or CREDIT"
    },
    required:[true,"Transaction type is required for the ledger entry"],
    immutable:true
  }
},{
    timestamps:true
})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);    
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("remove",preventLedgerModification);
ledgerSchema.pre("update",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete",preventLedgerModification);
ledgerSchema.pre("findOneAndRemove",preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("replaceOne",preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);

export default mongoose.model("Ledger",ledgerSchema);