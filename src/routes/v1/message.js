import express from 'express';

import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import { getMessagesController } from '../../controllers/messageController.js';

const router = express.Router();

router.get('/', isAuthenticated, getMessagesController);

export default router;