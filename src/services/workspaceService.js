import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addEmailToMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import { workspaceJoinMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

const isUserAdminOfWorkspace = (workspace, userId) => {
    return workspace.members.find((member) => (member.memberId.toString() === userId || member.memberId._id.toString() === userId) && member.role === 'admin');
}

export const isUserMemberOfWorkspace = (workspace, userId) => {
    return workspace.members.find((member) => member.memberId._id.toString() === userId);
} 

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
    return workspace.channels.find((channel) => channel.name.toLowerCase() === channelName.toLowerCase());
}

export const createWorkspaceService = async (WorkspaceData) => {
    try {
        const joinCode = uuidv4().substring(0, 6).toUpperCase();
        const response = await workspaceRepository.create({
            name: WorkspaceData.name,
            description: WorkspaceData.description,
            joinCode,
        });

        await workspaceRepository.addMemberToWorkspace(response._id, WorkspaceData.owner, 'admin');

        const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(response._id, 'general');

        return updatedWorkspace;
    } catch (error) {
        console.log('Create workspace service error', error);
        if (error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }
        if (error.name === 'MongoServerError' && error.code === 11000) {
            throw new ValidationError(
                {
                    error: ['A workspace with same details already exists']
                },
                'A workspace with same details already exists'
            );
        }
        throw error;
    }
}

export const getWorkspacesUserIsMemberOfService = async (userId) => {
    try {
        const workspaces = await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
        return workspaces;
    } catch (error) {
        console.log("Get workspaces user is member of service error", error);
        throw error;
    }
}

export const deleteWorkspaceService = async (workspaceId, userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }

        const isAllowed = isUserAdminOfWorkspace(workspace, userId);
        if(isAllowed) {
            await channelRepository.deleteMany(workspace.channels); 
            const response = await workspaceRepository.delete(workspaceId);
            return response;
        }
        throw new ClientError({
            explanation: "User is not the admin of the workspace",
            message: "User is not allowed to delete the workspace",
            statusCode: StatusCodes.UNAUTHORIZED,
        })
    } catch (error) {
        console.log("Delete workspaces user is admin of service error", error);
        throw error;
    }
}

export const getWorkspaceService = async (workspaceId, userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceById(workspaceId);
        if(!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        const isMember = isUserMemberOfWorkspace(workspace, userId);
        if(!isMember) {
            throw new ClientError({
                explanation: "User is not member of this workspace",
                message: "User is not allowed to get this workspace",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }

        return workspace;
    } catch (error) {
        console.log("Get workspaces service error", error);
        throw error;
    }
} 
export const getWorkspaceByJoinCode = async (joinCode, userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode);
        if(!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                mesage: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        const isMember = isUserMemberOfWorkspace(workspace, userId);
        if(!isMember) {
            throw new ClientError({
                explanation: "User is not member of this workspace",
                message: "User is not allowed to get this workspace",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }
        return workspace;
    } catch (error) {
        console.log("Get workspace by joinCode service error", error);
        throw error;
    }
}

export const updatedWorkspaceSerice = async (workspaceId, workspaceData, userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                mesage: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        const isAdmin = isUserAdminOfWorkspace(workspace, userId);
        if(!isAdmin) {
            throw new ClientError({
                explanation: "User is not admin of this workspace",
                message: "User is not allowed to update this workspace",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        } 
        const updatedWorkspace = await workspaceRepository.update(workspaceId, workspaceData);
        return updatedWorkspace;
    } catch (error) {
        console.log("Update workspace service error", error);
        throw error;
    }
} 

export const resetWorkspaceJoinCodeService = async(workspaceId, userId) => {
    try {
        const newJoinCode = uuidv4().substring(0, 6).toUpperCase();
        const updatedWorkspace = await updatedWorkspaceSerice(workspaceId, { joinCode: newJoinCode }, userId);
        return updatedWorkspace;
    } catch (error) {
        console.log("resetWorkspaceJoinCodeService error: ", error);
        throw error;        
    }
} 

export const addMemberToWorkspaceSerivce = async (workspaceId, memberId, role, userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                mesage: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        const isAdmin = isUserAdminOfWorkspace(workspace, userId);
        if(!isAdmin) {
            throw new ClientError({
                explanation: "User is not admin of this workspace",
                message: "User is not allowed to update this workspace",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }
        const isValidUser = await userRepository.getById(memberId);
        if(!isValidUser) {
            throw new ClientError ({
                explanation: "Invalid data sent from the client",
                message: "User not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        const isMember = isUserMemberOfWorkspace(workspace, memberId);
        if(isMember) {
            throw new ClientError ({
                explanation: "User is already a member of this workspace",
                message: "User is already a member of this workspace",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }
        const response = await workspaceRepository.addMemberToWorkspace(workspaceId, memberId, role);
        addEmailToMailQueue({...workspaceJoinMail(workspace), to: isValidUser.email})
        return response;
    } catch (error) {
        console.log("Add member to workspace service error", error);
        throw error;
    }
} 

export const addChannelToWorkspaceService = async (workspaceId, channelName, userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceById(workspaceId);
        if(!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                mesage: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
        const isAdmin = isUserAdminOfWorkspace(workspace, userId);
        if(!isAdmin) {
            throw new ClientError({
                explanation: "User is not admin of this workspace",
                message: "User is not allowed to update this workspace",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }
        const isChannelAlreadyExist = isChannelAlreadyPartOfWorkspace(workspace, channelName);
        if(isChannelAlreadyExist) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                message: "Channel already part of workspace",
                statusCode: StatusCodes.FORBIDDEN,
            });
        }
        const response = await workspaceRepository.addChannelToWorkspace(workspaceId, channelName);
        return response;
    } catch (error) {
        console.log("Add channel to workspace service error");
        throw error;
    }
};

export const joinWorkspaceService = async(workspaceId,joinCode, userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceById(workspaceId);
        if(!workspace) {
            throw new ClientError({
                explanation: "Invalid data sent from the client",
                mesage: "Workspace not found",
                statusCode: StatusCodes.NOT_FOUND,
            });
        }
    
        if(workspace.joinCode !== joinCode) {
            throw new ClientError({
                explanation: "Invalid data sent form client",
                message: "Invalid join code",
                statusCode: StatusCodes.UNAUTHORIZED,
            });
        }
        const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(workspaceId, userId, 'member');
        return updatedWorkspace;
    } catch (error) {
        console.log("joinWorkspaceService error");
        throw error;
    }
}