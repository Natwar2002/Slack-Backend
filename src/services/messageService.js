import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js"
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getMessagesService = async(messageParams, page, limit, userId) => {
    try {
        const channelDetails = await channelRepository.getChannelWithDetails(messageParams.channelId);

        const workspace = channelDetails.workspaceId;

        const isMember = isUserMemberOfWorkspace(workspace, userId);

        if(!isMember) {
            throw new ClientError({
                explanation: "User is not member of this workspace",
                message: "User is not allowed to get this workspace",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }

        const messages = await messageRepository.getPaginatedMessages(messageParams, page, limit);
        return messages;
    } catch (error) {
        console.log("Get messages service error: ",error);
        throw error
    }
}

export const createMessageService = async(message) => {
    try {
        const newMessage = await messageRepository.create(message);
        const messageDetails = await messageRepository.getMessageDetails(newMessage._id);

        return messageDetails;
    } catch (error) {
        console.log("Create message service error: ", error);
        throw error;
    }
}