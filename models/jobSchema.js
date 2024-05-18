import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please Provide job title"],
        minLength: [3, "Job Title should contain atleast 3 characters"],
        maxLength: [50, "Job Title cannot exceed 50 characters"],
    },
    description:{
        type: String,
        required: [true, "Please prove job description"],
        minLength: [3, "Job Description should contain atleast 3 characters"],
        maxLength: [500, "Job Description cannot exceed 500 characters"],
    },
    category:{
        type: String,
        required: [true, "Job Category is required"],
    },
    country:{
        type: String,
        required: [true, "Job Country is required"],
    },
    city:{
        type: String,
        required: [true, "Job City is required"],
    },
    location:{
        type: String,
        required: [true, "Job Location is required"],
    },
    fixedSalary:{
        type: Number,
        min: [0, "Fixed salary must be a positive number"],
        max: [999999999, "Fixed salary cannot exceed 999,999,999"],
    },
    salaryFrom:{
        type: Number,
        min: [0, "Salary must be a positive number"],
        max: [999999999, "Salary cannot exceed 999,999,999"],
    },
    salaryTo:{
        type: Number,
        min: [0, "Salary must be a positive number"],
        max: [999999999, "Salary cannot exceed 999,999,999"],
    },
    expired:{
        type: Boolean,
        default: false,
    },
    jobPostedOn:{
        type: Date,
        default: Date.now,
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true],
    },

})

export const Job = mongoose.model("Job", jobSchema);