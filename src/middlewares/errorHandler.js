import { ApplicationError } from "../../utils/error.js";

// Application level error handler
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApplicationError) {
        return res.status(err.code).send(err.message);
    }
    if (err instanceof Error) {
        throw new Error('Something went wrong');
    }
    next();
}

export default errorHandler;