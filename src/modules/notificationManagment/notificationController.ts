import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { Notification } from "./notificationModel";
import * as notificationService from "./notificationService";

export async function createNotification(createNotificationDto: Object) {

    try {
        const notification: Notification =
            await notificationService.createNotification(createNotificationDto);

    } catch (error) {
        console.log(error);
    }
}

export async function getNotifications(req: Request, res: Response) {

    try {
        const userId = new Types.ObjectId(res.get("userId"));

        const notifications: Array<Notification> =
            await notificationService.getNotifications(userId);
            
        res.status(httpStatus.OK).send({
            data: notifications,
            message: "Notifications fetched successfully",
            status: httpStatus.OK,
        });
    } catch (error) {
        console.log(error);
        const err: Error = error as Error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}



export async function updateNotification(req: Request, res: Response) {
    try {
        const notificationId: Types.ObjectId = new Types.ObjectId(req.params.id);
        const notification: Notification | null =
            await notificationService.updateNotificationById(
                notificationId,
                req.body
            );
        res.status(httpStatus.OK).send({
            data: notification,
            status: httpStatus.OK,
            message: "Notification updated successfully",
        });
    } catch (error) {
        console.log(error);
        const err: Error = error as Error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

export async function deleteNotification(req: Request, res: Response) {
    try {
        const notificationId: Types.ObjectId = new Types.ObjectId(req.params.id);
        const notification: Notification | null =
            await notificationService.deleteNotificationById(notificationId);
        res.status(httpStatus.OK).send({
            data: notification,
            status: httpStatus.OK,
            message: "Notification updated successfully",
        });
    } catch (error) {
        console.log(error);
        const err: Error = error as Error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

export async function getNotificationById(req: Request, res: Response) {
    try {
        const notificationId: Types.ObjectId = new Types.ObjectId(req.params.id);
        const notification: Notification | null =
            await notificationService.getNotificationById(notificationId);
        res.status(httpStatus.OK).send({
            data: notification,
            status: httpStatus.OK,
            message: "Notification fetched successfully",
        });
    } catch (error) {
        console.log(error);
        const err: Error = error as Error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
}

