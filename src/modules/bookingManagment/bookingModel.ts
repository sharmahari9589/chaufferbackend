import mongoose, { Document, Schema, Types, model, Mongoose, StringExpressionOperator } from "mongoose";

export enum BookingMode {
  ByDistance = "distance",
  ByTime = "time",
}

export enum BookingStatus {
  Pending = "pending",
  Accepted = "accepted",
  NotUsed = "notused",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum PaymentStatus {
  Unpiad = "unpiad",
  Paid = "paid",
  Refunded ="refunded"
}

export interface Booking extends Document {
  userId: mongoose.ObjectId;
  carId: mongoose.ObjectId;
  allocateVandorId: mongoose.ObjectId;
  bookingMode: BookingMode;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  allocateChaufferName: string;
  allocatedChaufferMobile: string;
  bookingDate: Date;
  checkoutId: string;
  transactionId: string;
  startTime: Date;
  startDate:Date;
  isAlloted: boolean;
  finalPrice:number;
  duration: number;
  from: string;
  to : string;
  chaufferLisecence:string;
  extraAmount:number;
  reasonExtra:string;
  noteForChauffer:string;
  specialReq:string;
  title:string;
  fullName:string;
  email:string;
  phone:string;
  distance:string;
  time:string;
  paymentUrl:string;
  bookingId:string;
}


const bookingSchema: Schema = new Schema<Booking>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    carId: {
      type: Types.ObjectId,
      ref: "car",
    },
    allocateVandorId: {
      type: Types.ObjectId,
      ref: "vendor",
    },
    checkoutId: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
    },
    bookingId:{
    type:String
    },
    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
    },
    bookingMode: {
      type: String,
      enum: Object.values(BookingMode),
    },
    bookingDate: {
      type: Date,
      default: new Date(),
    },
    allocateChaufferName: {
      type: String,
    },
    allocatedChaufferMobile: {
      type: String,
    },
    startTime: {
      type: Date,
    },
    startDate:{
      type:Date
    },
    isAlloted: {
      type: Boolean,
      default: false,
    },
    finalPrice:{
      type:Number
    },
    duration:{
      type:Number
    },
    from:{
      type :String
    },
    to :{
      type:String
    },
    chaufferLisecence:{
      type:String
    },
extraAmount:{
  type:Number
},
reasonExtra:{
  type:String
},
noteForChauffer:{
  type:String
},
title:{
  type:String
},
fullName:{
  type:String
},
email:{
  type:String
},
specialReq:{
  type:String
},
phone:{
  type:String
},
distance:{
  type:String
},
time:{
  type:String
},
paymentUrl:{
  type:String
}



  },
  {
    timestamps: true,
  }
);





export default model<Booking>("booking", bookingSchema);
