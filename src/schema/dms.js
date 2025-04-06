import mongoose from "mongoose";

const dmSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Message body is required'],
    },
    image: {
        type: String,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Sender ID is required"],
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "receiver ID is required"],
    },
}, { timestamps: true });

const Dm = mongoose.model('Dm', dmSchema);

export default Dm;