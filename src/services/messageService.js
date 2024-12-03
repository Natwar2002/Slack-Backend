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