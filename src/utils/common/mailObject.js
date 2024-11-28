import { MAIL_ID } from "../../config/serverConfig.js";

export const workspaceJoinMail = function(workspace) {
    return {
        from: MAIL_ID,
        subject: `You've been added to a workspace`,
        text: `Congratulations! you've been added to the workspace ${workspace.name}`
    }
}