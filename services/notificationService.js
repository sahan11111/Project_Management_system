import {Notification} from '../models/notification.js';

export const createNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
};

export const notifyUser = async (
    userId,
    message,
    type = "general",
    // link = null,
    priority = "low"
) => {
    const notificationData = {
        user: userId,
        message,
        type,
        // link,
        priority,
    };
    return await createNotification(notificationData);
};