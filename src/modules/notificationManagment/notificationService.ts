import { Types } from "mongoose";
import notificationModel, { Notification } from "./notificationModel";

/**
 * @description This function creates the notification
 * @param createNotificationDto
 * @returns {Promise<Notification>}
 * @author Sourav Argade
 */

export async function createNotification(
  createNotificationDto: any
): Promise<Notification> {
  return await notificationModel.create(createNotificationDto);
}

/**
 * @description This function gets the notifications of a user
 * @param {Types.ObjectId} userId
 * @returns {Promise<Array<Notification>>}
 * @author Sourav Argade
 */
export async function getNotifications(userId: Types.ObjectId): Promise<Array<Notification>> {
  
  return await notificationModel
    .find({
      notificationTo: { $in: [userId] },
    })
    .sort({ createdAt: -1 });
}


/**
 * @description This funtion is used to get the notification by id
 * @param {Types.ObjectId} notificationId
 * @returns {Promise<Notification>}
 * @author Sourav Argade
 */
export async function getNotificationById(
  notificationId: Types.ObjectId
): Promise<Notification | null> {
  return await notificationModel.findById(notificationId);
}

/**
 * @description This function is used to update the notification by id
 * @param {Types.ObjectId} notificationId
 * @param {any} updateDto
 * @returns {Promise<Notification|null>}
 * @author Sourav Argade
 */
export async function updateNotificationById(
  notificationId: Types.ObjectId,
  updateDto: any
): Promise<Notification | null> {
  return await notificationModel.findByIdAndUpdate(notificationId, updateDto);
}

/**
 * @description This function is used to delete the notification by id
 * @param {Types.ObjectId} notificationId
 * @returns {Promise<Notification|null>}
 * @author Sourav Argade
 */
export async function deleteNotificationById(
  notificationId: Types.ObjectId
): Promise<Notification | null> {
  return await notificationModel.findByIdAndDelete(notificationId);
}
