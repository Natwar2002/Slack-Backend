import express from "express";

import { createOrderController } from "../../controllers/paymentController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post('/order', isAuthenticated, createOrderController);

export default paymentRouter;