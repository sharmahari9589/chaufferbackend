import mongoose, { Document, model, ObjectId, Schema } from "mongoose";

export interface Notification extends Document {
  notificationTitle: string;
  notificationDescription: string;
  notificationType: NotificationType;
  notificationBy: mongoose.Types.ObjectId;
  notificationTo: mongoose.Types.ObjectId[]; // Corrected type to array of ObjectId
  status: Status;
}

export enum Status {
  Read = "read",
  Unread = "unread"
}

export enum NotificationType {
  paymentNotification = "payment_notification",
  BookingNotification = "booking_notification",
  registerNotification = "register_notification",
}

const notificationSchema: Schema = new Schema<Notification>(
  {
    notificationTitle: {
      type: String,
    },
    notificationDescription: {
      type: String,
    },
    notificationBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    notificationTo: {
      type: [mongoose.Schema.Types.ObjectId], // Corrected type to array of ObjectId
    },
    notificationType: {
      type: String,
      enum: Object.values(NotificationType), // Use Object.values to enforce enum values
    },
    status: {
      type: String,
      enum: Object.values(Status), // Use Object.values to enforce enum values
      default: Status.Unread,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Notification>("notification", notificationSchema);
