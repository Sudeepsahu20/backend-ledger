//create a schema for account with the following fields: accountName, accountType, balance, userId
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true,"Account must be associated with the user"],
        index: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status must be either ACTIVE, FROZEN, or CLOSED",
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true,"Currency is required for the account"],
        default: "INR"
    }
}, {
    timestamps: true
});


accountSchema.index({ user: 1,status: 1 });
export default mongoose.model("Account", accountSchema);