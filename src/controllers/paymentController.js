import { StatusCodes } from "http-status-codes";

import razorpay from "../config/razorpayConfig.js";
import { CURRENCY, RECEIPT_SECRET } from "../config/serverConfig.js";
import { createPaymentService, updatePaymentStatusService } from "../services/paymentService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from '../utils/common/responseObject.js';

export const createOrderController = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount,
            currency: CURRENCY,
            receipt: RECEIPT_SECRET,
        };
        const order = await razorpay.orders.create(options);
        console.log(order);
        
        await createPaymentService(order.id, order.amount);

        if(!order) {
            throw new Error('Failed to create order');
        }
        return res.status(StatusCodes.CREATED).json(successResponse(order, 'Order Created Successfully'));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}

export const capturePaymentController = async (req, res) => {
    try {
        console.log(req.body);
        
        const payment = await updatePaymentStatusService(req.body.orderId, req.body.status, req.body.paymentId, req.body.signature);
        return res.status(StatusCodes.CREATED).json(successResponse(payment, 'Payment Captured Successfully'));
    } catch (error) {
        console.log(error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}