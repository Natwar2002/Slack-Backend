import { StatusCodes } from "http-status-codes";

import { S3 } from "../config/awsConfig.js";
import { AWS_BUCKET_NAME } from "../config/serverConfig.js";
import { getChannelMessages, getDMs } from "../services/messageService.js"
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";

export const getChannelMessagesController = async (req, res) => {
    try {
        const response = await getChannelMessages({ channelId: req.params.channelId }, req.query.page || 1, req.query.limit || 20, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, 'Messages fetched successfully'));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getDMsController = async (req, res) => {
    try {
        let { senderId, receiverId } = req.params;
        const response = await getDMs({ senderId, receiverId }, req.query.page || 1, req.query.limit || 20);
        return res.status(StatusCodes.OK).json(successResponse(response, 'Messages fetched successfully'));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getPresignedUrlFromAWS = async(req, res) => {
    try {
        const url = await S3.getSignedUrlPromise('putObject', {
            Bucket: AWS_BUCKET_NAME,
            Key: `${Date.now()}`,
            Expires: 60
        });
        return res.status(StatusCodes.OK).json(successResponse(url, 'Presigned URL generated successfully'));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}