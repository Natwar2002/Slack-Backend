import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async(channelId, userId) => {
    try {
        const channel = await channelRepository.getChannelWithDetails(channelId);
        if(!channel || !channel.workspaceId) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Channel not found',
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        const isUserPartOfWorkspace = isUserMemberOfWorkspace(channel.workspaceId, userId);
        if(!isUserPartOfWorkspace) {
            throw new ClientError({
                explanation: `User isn't part of workspace hence can't access this channel`,
                message: `User isn't past of workspace`,
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }
        return channel;
    } catch (error) {
        console.log("Get channel by ID service error", error);
        throw error;
    }
};