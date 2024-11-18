import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import { customErrorResponse } from "../utils/common/responseObject";
import { JWT_SECRET } from "../config/serverConfig";
import userRepository from '../repositories/userRepository.js'

export const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.headers['x-access-token'];

        if(!token) {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: "Invalid data sent from the client",
                message: "No auth token provided"
            }));
        }

        const response = jwt.verify(token, JWT_SECRET);

        if(!response) {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: "Invalid data sent from the client",
                message: "Invalid auth token provided"
            }));
        }
        const user = await userRepository.getById(response.id);

        if(!user) {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse({
                explanation: "Invalid data sent from the client",
                message: "The user is no longer exist"
            }));
        }
        req.user = user.id;
        next();
    } catch (error) {
        console.log("Auth middleware error");
    }
}