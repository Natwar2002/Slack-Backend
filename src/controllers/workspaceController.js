import { StatusCodes } from "http-status-codes";

import { addChannelToWorkspaceService, addMemberToWorkspaceSerivce, createWorkspaceService, deleteWorkspaceService, getWorkspaceByJoinCode, getWorkspaceService, getWorkspacesUserIsMemberOfService, updatedWorkspaceSerice } from "../services.js/workspaceService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js"

export const createWorkspaceController = async(req, res) => {
    try {
        const response = await createWorkspaceService({ ...req.body, owner: req.user });
        return res.status(StatusCodes.CREATED).json(successResponse(response, "Workspace created successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};

export const getWorkspacesUserIsMemberOfController = async(req, res) => {
    try {
        const response = await getWorkspacesUserIsMemberOfService(req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Workspaces fetched successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};

export const deleteWorkspaceController = async (req, res) => {
    try {
        const response = await deleteWorkspaceService(req.params.workspaceId, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Workspace deleted successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getWorkspaceController = async(req, res) => {
    try {
        const response = await getWorkspaceService(req.params.workspaceId, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Workspace deleted successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const getWorkspaceByJoinCodeController = async (req, res) => {
    try {
        const response = await getWorkspaceByJoinCode(req.params.joincode, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Got the workspace using join code"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};

export const updatedWorkspaceController = async (req, res) => {
    try {
        const response = await updatedWorkspaceSerice(req.params.workspaceId, req.body, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Workspace updated successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};

export const addMemberToWorkspaceController = async (req, res) => {
    try {
        const response = await addMemberToWorkspaceSerivce(req.params.workspaceId, req.body.memberId, req.body.role || 'member' , req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Member added to workspace successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};

export const addChannelToWorkspaceController = async (req, res) => {
    try {
        const response = await addChannelToWorkspaceService(req.params.workspaceId, req.body.channelName, req.user);
        return res.status(StatusCodes.OK).json(successResponse(response, "Channel added to workspace successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};
