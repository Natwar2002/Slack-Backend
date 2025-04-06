import express from 'express';

import { getChannelMessagesController, getDMsController, getPresignedUrlFromAWS } from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/pre-signed-url', isAuthenticated, getPresignedUrlFromAWS);
router.get('/:channelId', isAuthenticated, getChannelMessagesController);
router.get('/dm/:senderId/:receiverId', isAuthenticated, getDMsController);

export default router;