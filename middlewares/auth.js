import {catchAsyncErrors} from "./catchAsyncErrors.js";
import ErrorHandler  from "./error.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.js";

export const  isAuthorized = catchAsyncErrors(async(req, res, next)=>{
    const {token} = req.cookies     // token generation will be done in utils folder
    if(!token){
        return next(new ErrorHandler("User not authorized", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
});