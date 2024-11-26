import Channel from '../schema/channel.js';
import crudRepository from './crudRepository.js';

const channelRepository = {
    ...crudRepository(Channel),
    getChannelWithDetails: async function (channelId) {
        const channel = await Channel.findById(channelId).populate('workspaceId');
        return channel;
    }
}

export default channelRepository;