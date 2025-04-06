import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Message body is required'],
    },
    image: {
        type: String,
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        default: null
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender ID is required"],
    },
    receiverId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        default: null
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;