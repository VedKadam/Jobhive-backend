import mongoose, { mongo } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Mandatory"],
        minLength: [2, "Name must  be atleast 2 characters"],
        // maxLength: [30, "Name cannot exceed 30 characters"],
        
    },
    email:{
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please provide valid email!"],
        unique: true,
    },
    phone: {
        type: Number,
        required: [true, "Number is Mandatory"],
    },
    password: {
        type: String,
        required: [true, "Password is Mandatory"],
        minLength: [8, "Password must contain atleast 8 characters, 1 number and a special symbol!"],
        // maxLength: [50, "Password cannot exceed 50 characters."],
        select: false,
    },
    role:{
        type: String,
        required: [true, "PLease provide your role."],
        enum: ["Job Seeker", "Employer"],   // either jobseeker or employer choose

    },
    createdAt: {
        type: Date, 
        default: Date.now, 
    },

});

// password hashing
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// comparing the passwords
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// JWT token generation
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE, })
}

export const User = mongoose.model("User", userSchema);