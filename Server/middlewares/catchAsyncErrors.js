const catchAsyncErrors = (theFunc) => (req, res, next) => { // Use to Catch Any Async Errors in the Programs - Accepting Functions as an Arguments & Returning a Promise
    Promise.resolve(theFunc(req, res, next)).catch(next);
}

module.exports = { catchAsyncErrors }

// const catchAsyncErrors = (theFunc) => {
//     return async (req, res, next) => {
//         try {
//             await theFunc(req, res, next);
//         } catch (error) {
//             next(error);
//         }
//     };
// };
