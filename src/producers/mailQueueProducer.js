import '../processors/mailProcessor.js';

import mailQueue from "../queues/mailQueue.js";

export const addEmailToMailQueue = (emailData) => {
    try {
        mailQueue.add(emailData);
        console.log("Email added to mail queue");
    } catch (error) {
        console.log("Add email to mail queue error", error);
    }
}