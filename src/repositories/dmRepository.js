import Dm from "../schema/dms.js";
import crudRepository from "./crudRepository.js";

const dmRepository = {
    ...crudRepository(Dm),

    getPaginatedMessages: async function (messageParams, page, limit) {
        const messages = await Dm.find(messageParams).sort({ createdAt: -1 }).skip((page - 1)*limit).limit(limit).populate('senderId', 'username email avatar');
        return messages;
    },

    getMessageDetails: async function (messageId) {
        const message = await Dm.findById(messageId).populate(
            'senderId',
            'username email avatar'
        );
        return message;
    }
}

export default dmRepository;