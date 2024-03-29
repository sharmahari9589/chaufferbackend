import { Request, Response } from "express";
import {
  generateOtp,
  generateOtpForPasswordReset,
} from "../../../utills/generateOtp";
import httpStatus from "http-status";
import { sendMail } from "../../../utills/sendMail";
import otpModel from "../authorization/otpModel";
import * as bookingService from "../bookingManagment/bookingService"
import { Types } from "mongoose";
import { BookingStatus, PaymentStatus } from "../bookingManagment/bookingModel";
import axios from "axios";
import * as notificationController from "../notificationManagment/notificationController"
import * as authService from '../authorization/authorizationService';
import { NotificationType } from "../notificationManagment/notificationModel";

//=================================Register OTP=================================//

export async function createPayment(req: Request, res: Response) {

let bookingId = new Types.ObjectId(req.params.id);

const transactionId = req.body.data;


try{
    let bookDto ={
      transactionId,
      paymentStatus: PaymentStatus.Paid,
        bookingStatus: BookingStatus.NotUsed,
    }

let upadtedBooking :any = await bookingService.updateBook(bookingId,bookDto);

let user :any = await authService.findUserById(upadtedBooking?.userId)

let notificationDto ={
    
  notificationTitle: 'Payment done',
  notificationDescription: `payment successful `,
  notificationBy: upadtedBooking?.userId ,
  notificationTo: [upadtedBooking?.userId],
  notificationType: NotificationType.BookingNotification,
}
   notificationController.createNotification(notificationDto) 


sendMail(
  user?.email,
  "Payment successfull for booking with Xactlane Chauffeur Service",
  `
  <!DOCTYPE html>
<html>

<head>
  <style>
    /* Inline CSS for styling */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      font-size: 24px;
      color: green;
    }
    /* Add more inline styles as needed */
  </style>
</head>

<body>
  <div class="container">
  <h1 style='color: Green'>Chauffeur Services</h1>
    <hr>
    <h4>Hello User,</h4>
    <pre style="font-family: Arial, sans-serif;">
        Congratulations on successfully registering with Chauffeur! We're delighted to have you on board.

        Your journey with us begins now. You have a chauffeur booked for your upcoming ride. Please reach out to the chauffeur named ${upadtedBooking?.allocateChaufferName} at ${upadtedBooking?.allocatedChaufferMobile} for any coordination and to ensure a smooth and timely experience.

        **Payment Information:**
        To enjoy your ride, please ensure that the payment for your booking has been successfully processed. You can check the payment status by logging in to http://localhost:5173/login.

        Should you need any assistance or have questions, our support team is here to help.

        Get ready for an amazing experience with Chauffeur!

        Remember, never share your personal information with anyone, not even if EXOAD asks you to.
      </pre>
    <h4>Regards,</h4>
    <h4>Team XECTLANE</h4>
  </div>
</body>

</html>

  `
);

res.status(httpStatus.CREATED).send({
    status: true,
    message: "Payement done succesfully"
})
}catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message })
}
}



export async function checkout(req: Request, res: Response)
{

    let userId = new Types.ObjectId(res.get("userId"));
    
    let bookingId = new Types.ObjectId(req.params.id);
    const {paymentUrl} = req.body;
   
    const bookDto ={
    paymentUrl
   }
     try{
   let data =   await bookingService.updateBook(bookingId,bookDto);
   res.status(httpStatus.OK).send("Updated")
     }
     catch(error){
res .status(httpStatus.INTERNAL_SERVER_ERROR).send({
  status:false,
  message:"Internal server error"
})
     }
        
      
        
        }
