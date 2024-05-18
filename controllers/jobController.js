import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs,
    });
});

export const postJob = catchAsyncErrors(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource.", 400));
    }

    const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("Please provide all job details.", 400));
    }

    // Check if either a ranged salary or a fixed salary is provided
    if (!(salaryFrom && salaryTo) && !fixedSalary) {
        return next(new ErrorHandler("Please provide either a fixed salary or a ranged salary.", 400));
    }

    // Check if both ranged salary and fixed salary are provided
    if ((salaryFrom && salaryTo) && fixedSalary) {
        return next(new ErrorHandler("Please provide either a fixed salary or a ranged salary, not both.", 400));
    }

    const postedBy = req.user._id;

    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy,
    });

    res.status(200).json({
        success: true,
        message: "Job posted successfully!",
        job
    });
});

export const getMyJobs = catchAsyncErrors(async(req, res, next)=>{
    const {role} = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource.", 400));
    }
    const myjobs = await Job.find({postedBy: req.user._id});
    res.status(200).json({
        success: true,
        myjobs,
    });
});

export const updateJob = catchAsyncErrors(async(req, res, next) =>{
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource.", 400));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Job not found!", 404));
    }
    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        job,
        message: "Job Updated Successfully!"
    });
});

export const deleteJob = catchAsyncErrors(async(req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new ErrorHandler("Job Seeker is not allowed to access this resource.", 400));
    }
    const {id} = req.params;  
    let job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Job not found!", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully!",
    })
});

export const getSinglejob = catchAsyncErrors(async(req, res, next) => {
    const {id} = req.params;
    try {
        const job = await Job.findById(id);
        if(!job){
            return next(new ErrorHandler("Job not found", 404));
        }
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        return next(new ErrorHandler("Invalid ID/Cast Error", 400));
    }
});