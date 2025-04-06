import User from "../schema/user.js";
import { createMessageService } from "../services/messageService.js";
import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECEIVED_EVENT } from "../utils/common/eventConstants.js";

export default function messageHandlers(socket, io) {
    // console.log("A user connected", socket.id);
    // socket.on("messageFromClient", (data) => {
    //     console.log("A user conneted", data);
    //     io.emit('new message', data.toUpperCase());
    // });
    socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) { 
        const { channelId, receiverId } = data;
        const messageResponse = await createMessageService(data);
        // socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
        if(channelId) {
            io.to(channelId).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
        } else if (receiverId) {
            const receiver = await User.findById(receiverId);

            if(receiver?.socketId) {
                io.to(receiver.socketId).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
            }
        }
        cb?.({
            success: true,
            message: "Successfully created the message",
            data: messageResponse
        });
    });
}
