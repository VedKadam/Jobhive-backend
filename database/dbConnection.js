import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN_STACK_JOB_PORTAL"
    }).then(() => {
        console.log('Connected to databse! ')
    }).catch((err) =>{
        console.log(`some error occured while connecting to databse: ${err}`);
    })
};