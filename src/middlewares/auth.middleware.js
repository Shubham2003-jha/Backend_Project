import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.models.js';

export const verifyJWT=asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
    
        if (!token) {
            return res.status(401).json(new ApiError(401, "Access token is missing or invalid"));
        }
    

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user= await User.findById(decoded._id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json(new ApiError(404, "Invalid access token"));
        }
        req.user = user; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json(new ApiError(403, "Invalid access token"));
    }
})



