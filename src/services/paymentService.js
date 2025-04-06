import crypto from 'crypto';

import { RAZORPAY_KEY_SECRET } from '../config/serverConfig.js';
import paymentRepository from '../repositories/paymentRepository.js';

export const createPaymentService = async (orderId, amount) => {
    const payment = await paymentRepository.create({ orderId, amount });
    return payment;
}

export const updatePaymentStatusService = async(orderId, status, paymentId, signature) => {
    try {
        if(status === 'Success') {
            const shaResponse = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
            console.log('Sha Response:', shaResponse);
            console.log('Signature: ',signature);
            if(shaResponse === signature) {
                const payment = await paymentRepository.updateOrder(orderId , { status, paymentId });
                return payment;
            } else {
                throw new Error("Payment Varification Failed");
            }
        }
    } catch (error) {
        console.log('Error in capturing payment', error);   
    }
}