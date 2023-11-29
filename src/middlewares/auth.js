import jwt from "jsonwebtoken";
import User from "../models/user_schema.js";
import { ApplicationError } from "../../utils/error.js";
import { ObjectId } from "mongodb";

const auth = async (req, res, next) => {
    // Retrieving token from authorization header
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    // validate the authorization token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = payload.userId;
        const verify = await User.findOne({ _id: new ObjectId(req.userId), tokens: { $elemMatch: { $eq: token } } });
        if (!verify) {
            return res.status(403).send("Unauthorized");
        }
    } catch (error) {
        console.log(error.message);
        return res.status(403).json('Unauthorized');
    }
    next();
};

export default auth;
