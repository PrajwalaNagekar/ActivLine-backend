
const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            // Only log server errors (500+) or errors without status code
            if (!error.statusCode || error.statusCode >= 500) {
                console.error('❌ Error in asyncHandler:', error);
            }
            next(error); // Pass error to global error handler
        }
    };
};

export { asyncHandler };