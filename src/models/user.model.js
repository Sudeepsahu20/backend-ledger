import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email should be required"],
        trim:true,
        lowerCase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid Email address"],
        unique:true
    },
    name:{
        type:String,
        required:[true,"Name feild is required"]
    },
    password:{
        type:String,
        required:[true,"Password should not be empty"],
        minLength:[6,"Password must contains more than 6 character"],
        select:false
    }
},{timestamps:true});

userSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.method.comparePassword=function(password){
    bcrypt.compare(password,this.password);
}


const userModel=mongoose.model("user",userSchema);
export default userModel;