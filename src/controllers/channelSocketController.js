import User from "../schema/user.js";
import { JOIN_CHANNEL, JOIN_DM, } from "../utils/common/eventConstants.js";

export default function messageHandlers(socket) {

    socket.on(JOIN_DM, async (data) => {
        try {
            await User.findByIdAndUpdate(data.userId, { socketId: socket.id });
        } catch (error) {
            console.error("Error updating socketId:", error);
        }
    });

    socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
        const roomId = data.channelId;
        socket.join(roomId);
        console.log(`User ${socket.id} joined the channel ${roomId}`);
        cb?.({
            success: true,
            message: 'Successfully joined the channel',
            data: roomId,
        });
    });

    socket.on("disconnect", async () => {
        try {
            await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
        } catch (error) {
            console.error("Error clearing socketId:", error);
        }
    });
}