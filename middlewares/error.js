// // error handling is done here
// class ErrorHandler extends Error{
//     constructor(message, statusCode){
//         super(message);
//         this.statusCode = statusCode
//     }
// }

// // creating middleware
// export const errorMiddleware = (err, req, res, next) =>{
//     err.message = err.message || "Internal server error";
//     err.statusCode = err.statusCode || 500;
//     if(err.name === "CaseError"){
//         const message = `Resource not found. Invalid ${err.path}`;
//         err = new ErrorHandler(message, 400);
//     }
//     if(err.name === 11000){
//         const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
//         err = new ErrorHandler(message, 400);
//     }
//     if(err.name === "JsonWebTokenError"){
//         const message = `Json Web token is invalied, try again! `;
//         err = new ErrorHandler(message, 400);
//     }
//     if(err.name === "TokenExpiredError"){
//         const message = `Json Web Token is Expired. Try Again.`;
//         err = new ErrorHandler(message, 400);
//     }
//     return res.status(err.statusCode).json({
//         success: false,
//         message: err.message,
//     });
    
// };

// export default ErrorHandler;


// above code gives error of headers being called multiple times


// error handling is done here
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// creating middleware
export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    let responseSent = false; // Flag to check if a response has been sent

    if (err.name === "CaseError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired. Try Again.`;
        err = new ErrorHandler(message, 400);
    }

    // Check if a response has already been sent
    if (!responseSent) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    } else {
        throw err; // Re-throw the error if a response has already been sent
    }
};
export default ErrorHandler;
