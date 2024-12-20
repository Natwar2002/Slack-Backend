import bcrypt from 'bcrypt';
import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js";
import { createJWT } from '../utils/common/authUtils.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export async function signUpService(data) {
    try {
        const newUser = await userRepository.create(data);
        return newUser;
    } catch (error) {
        console.log(error);
        if(error.name === "ValidationError"){
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }
        if(error.name === 'MongoServerError' && error.code === 11000) {
            throw new ValidationError({
                error: ["A user with same email or username alread exist"]
            },
            "A user with same email or username alread exist"
        )
        }
    }
}

export async function signInService(data) {
    try {
        const user = await userRepository.getByEmail(data.email);
        if(!user) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "No registered user found with this email",
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const isMatch = bcrypt.compareSync(data.password, user.password);
        if(!isMatch) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Invalid password, please try again",
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        return{
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
            token: createJWT({ id: user._id, email: user.email })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function resetPas(email) {
    const user = await userRepository.getByEmail(email);
    if(!user) {
        throw new ClientError({
            explanation: "Invalid data sent from the client",
            message: "No registered user found with this email",
            statusCode: StatusCodes.BAD_REQUEST
        });
    }
    
}