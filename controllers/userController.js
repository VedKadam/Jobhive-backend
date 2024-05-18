import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import {User} from "../models/user.js";
import {sendToken} from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async(req, res, next) => {
    const {name, email, phone, role, password} = req.body;             // req. body means fetching data from frontend
    
    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler("Please fill all the the fields! "));
    }
      // Check if the email already exists in the database
    const isEmail = await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists! "));   
    }
   

    
    const user = await User.create({name, email, phone, role, password});
    res.status(200).json({
        success: true,
        message: "User Registered",
        user, 
    })
    sendToken(user, 200, res, "User Registered Successfully!");
});

export const login = catchAsyncErrors(async(req, res, next)=>{
    const { email, password, role } = req.body;
    if(!email ||  !password || !role){
        return next(new ErrorHandler("Please provdide Email, Password and Role.", 400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }
    if(user.role !== role){
        return next(new ErrorHandler("user with this role not found!", 400));
    }
    sendToken(user, 200, res, "User Logged In Successfully!");
});

export const logout = catchAsyncErrors(async(req, res, next) => {
    res.status(201).cookie("token", "",{
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "None", 
    }).json({
        success: true,
        message: "User Logged Out Successfully!",
    });
});

export const getUser = catchAsyncErrors((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});