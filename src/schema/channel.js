import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Channel name is required'],
    }
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;