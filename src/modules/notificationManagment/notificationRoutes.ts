import express from 'express';
import * as notificationController from "./notificationController"
import verify from '../../middlware/jwt.auth';


const notificationRoutes = express();



notificationRoutes.get("/getNotification",verify, notificationController.getNotifications);
notificationRoutes.get("/notificationsById/:id", notificationController.getNotificationById);
notificationRoutes.post("/crate-notification", notificationController.createNotification);
notificationRoutes.post("/update/:id", notificationController.updateNotification);
notificationRoutes.post("/delete/:id", notificationController.deleteNotification);



export default notificationRoutes ;