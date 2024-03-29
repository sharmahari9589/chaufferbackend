import { Request, Response } from "express";
import * as authService from "../authorization/authorizationService";
import * as vandorService from "../vendorManagment/vendorService";
import * as bookService from "../bookingManagment/bookingService";
import httpStatus from "http-status";
import { sendMail } from "../../../utills/sendMail";
import { Types } from "mongoose";
import { BookingStatus, PaymentStatus } from "../bookingManagment/bookingModel";
import axios from "axios";
import { NotificationType } from "../notificationManagment/notificationModel";
import * as notificationController from "../notificationManagment/notificationController"


//=================================update-profile=================================//
export async function updateProfileById(req: Request, res: Response) {
  let role = res.get("role");
  let { fullName, email, phone,_id,zipCode,address } = req.body.value;
  let userId = new Types.ObjectId(_id);

  let user = await authService.findUserById(userId);

  try {
    if (role == "admin") {
      let userDto = {
        fullName,
        email,
        phone,
        zipCode,
        address
      };
      await authService.findUserAndUpdateProfile(userId, userDto);
      res.status(httpStatus.CREATED).send({
        status: true,
        message: "Profile upadted succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//==============================Delete-profile=================================//
export async function deleteUser(req: Request, res: Response) {
  let role = res.get("role");
  let userId = new Types.ObjectId(req.params.id);
  let { fullName, email, phone } = req.body;
  let user = await authService.findUserById(userId);

  try {
    if (role == "admin") {
      await authService.findUserAndDelete(userId);
      res.status(httpStatus.CREATED).send({
        status: true,
        message: "User Deleted succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}
//============================== find all user =================================//
export async function getAllUser(req: Request, res: Response) {
  let role = res.get("role");
  try {
    if (role == "admin") {
      let user = await authService.findAllUser();
      res.status(httpStatus.CREATED).send({
        status: true,
        data: user,
        message: "User fetched succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}
//============================== Verify  Vandor =================================//
export async function verifyVandor(req: Request, res: Response) {
  let role = res.get("role");
  let vandorId = new Types.ObjectId(req.params.id);
  try {
    if (role == "admin") {
      let verifiedVandor: any = await vandorService.findVandorAndVerify(
        vandorId
      );
      sendMail(
        verifiedVandor?.email,
        "Welcome to XACTLANE Chauffeur Service",
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
            <h4>Hello Vendor,</h4>
            <pre style="font-family: Arial, sans-serif;">
          Congratulations! Your profile with XACTLANE Chauffeur Service has been approved. Now, you will receive emails whenever a booking is created. If you are available, please contact our admin to allocate your chauffeur for the assignment.
        
         If you need any assistance or have questions, our support team is ready to help.
        
          Get ready for an amazing experience with XACTLANE Chauffeur Service!
            </pre>
            <h4>Regards</h4>
            <h4>Team XACTLANE</h4>
          </div>
        </body>
        
        </html>
        `
      );

      return res.status(httpStatus.CREATED).send({
        status: true,
        message: "Vandor verified",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}
//============================== find all vandor =================================//
export async function getAllVandor(req: Request, res: Response) {
  let role = res.get("role");
  try {
    if (role == "admin") {
      let vandor = await vandorService.getAllVandor();
      res.status(httpStatus.CREATED).send({
        status: true,
        data: vandor,
        message: "Vandor fetched succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//============================== find all vandor on regex =================================//

export async function getAllVandorByName(req: Request, res: Response) {
  let role = res.get("role");
  let val = req.query.search;
  try {
    if (role == "admin") {
      let vandor = await vandorService.getAllVandorByName(val);
      res.status(httpStatus.CREATED).send({
        status: true,
        data: vandor,
        message: "Vandor fetched succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//============================== find all vandor on regex =================================//



export async function getVandorById(req: Request, res: Response) {
  let role = res.get("role");
  try {
    if (role == "admin") {
      let id = new Types.ObjectId(req.params.id)
      let vandor = await vandorService.getVandorById(id)
      res.status(httpStatus.CREATED).send({
        status: true,
        data: vandor,
        message: "Vandor fetched succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//============================== update vandor =================================//
export async function updateVandor(req: Request, res: Response) {
  let role = res.get("role");
  let { fullName, email, phone, address, zipCode, _id,companyName,additonalInfo  } = req.body.value;
    
  
  let vandorId = new Types.ObjectId(_id);
  try {
    if (role == "admin") {
      const vandorDto = {
        fullName,
        email,
        phone,
        address,
        zipCode,
        companyName,
        additonalInfo
      };

      

      let vandor = await vandorService.updateVandor(vandorId, vandorDto);
      
      res.status(httpStatus.CREATED).send({
        status: true,
        message: "Vandor upadted succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}
//============================== update vandor =================================//
export async function createVandor(req: Request, res: Response) {
  let role = res.get("role");
  let { name, email, phone, address, zipCode,companyName,additonalInfo } = req.body;
  
  try {
    if (role == "admin") {
      const vandorDto = {
        fullName:name,
        email,
        phone,
        address,
        zipCode,
        companyName,
        additonalInfo
      };
      let vand = await vandorService.findSingleVandor(email);
      
      if(vand){
        res.status(httpStatus.UNAUTHORIZED).send({
          status: true,
          message: "vandor already exist with this email",
        });
      }
      else{
        let vandor = await vandorService.signupVandor(vandorDto);
        res.status(httpStatus.CREATED).send({
          status: true,
          message: "Vandor created succesfully",
        });
      }
    
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}
//============================== delete vandor =================================//
export async function deleteVandor(req: Request, res: Response) {
  let role = res.get("role");
  let vandorId = new Types.ObjectId(req.params.id);
  try {
    if (role == "admin") {
      let vandor = await vandorService.deleteVandor(vandorId);
      res.status(httpStatus.CREATED).send({
        status: true,
        message: "Vandor deleted succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}
//============================== booking allotment =================================//

export async function alltBooking(req: Request, res: Response) {
  const bookingId = new Types.ObjectId(req.params.id);
  const { allocateChaufferName, allocatedChaufferMobile, allocateVandorId } =
    req.body;
    const data: any = req.files;
  try {

    if(data[0]){
      const imgDto: any = {
        name: data[0].originalname,
        path: data[0].path,
      };
    const bookingDto = {
      allocateChaufferName,
      allocatedChaufferMobile,
      allocateVandorId,
      bookingStatus: BookingStatus.Accepted,
      isAlloted: true,
      chaufferLisecence:imgDto.path
    };
    
  
    const book = await bookService.updateBook(bookingId, bookingDto);

    const booking:any = await bookService.findBookById(bookingId);

    const user :any = await authService.findUserById(booking?.userId);

    let admin = await authService.findAdmin();
    let adminId = admin?.map((a:any)=>{
      return a?._id
    })


    let notificationDto ={
    
      notificationTitle: 'Booking alloted',
      notificationDescription: `Booking alloted to chauffer `,
      notificationBy: adminId,
      notificationTo: [booking?.userId],
      notificationType: NotificationType.BookingNotification,
  }
       notificationController.createNotification(notificationDto) 


    sendMail(
      user?.email,
      "Booking  Alloted with Xactlane Chauffeur Service",
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
      
            Your journey with us begins now. You have a chauffeur booked for your upcoming ride. Please reach out to the chauffeur named ${booking?.allocateChaufferName} at ${booking?.allocatedChaufferMobile} for any coordination and to ensure a smooth and timely experience.
      
            Log in to http://localhost:5173/login to explore all the incredible features we have to offer. Should you need any assistance or have questions, our support team is here to help.
      
            Get ready for an amazing experience with Chauffeur!
      
            Remember, never share your personal information with anyone, not even if EXOAD asks you to.
          </pre>
          <h4>Regards,</h4>
          <h4>Team EXOAD</h4>
        </div>
      </body>
      </html>
      `
    );


    res.status(httpStatus.OK).send({
      status: true,
      message: "Booking alloted succesfully",
    });


  }
  else{
    const bookingDto = {
      allocateChaufferName,
      allocatedChaufferMobile,
      allocateVandorId,
      bookingStatus: BookingStatus.Accepted,
      isAlloted: true,
    };
  
    const book = await bookService.updateBook(bookingId, bookingDto);

    const booking:any = await bookService.findBookById(bookingId);

    const user :any = await authService.findUserById(booking?.userId);
    let admin = await authService.findAdmin();
    let adminId = admin?.map((a:any)=>{
      return a?._id
    })


    let notificationDto ={
    
      notificationTitle: 'Booking alloted',
      notificationDescription: `Booking alloted to chauffer `,
      notificationBy: adminId,
      notificationTo: [booking?.userId],
      notificationType: NotificationType.BookingNotification,
  }
       notificationController.createNotification(notificationDto) 


    sendMail(
      user?.email,
      "Booking  Alloted with Chauffeur Service",
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
      
            Your journey with us begins now. You have a chauffeur booked for your upcoming ride. Please reach out to the chauffeur named ${booking?.allocateChaufferName} at ${booking?.allocatedChaufferMobile} for any coordination and to ensure a smooth and timely experience.
      
            Log in to http://localhost:5173/login to explore all the incredible features we have to offer. Should you need any assistance or have questions, our support team is here to help.
      
            Get ready for an amazing experience with Chauffeur!
      
            Remember, never share your personal information with anyone, not even if EXOAD asks you to.
          </pre>
          <h4>Regards,</h4>
          <h4>Team EXOAD</h4>
        </div>
      </body>
      </html>
      `
    );
     
  

    res.status(httpStatus.OK).send({
      status: true,
      message: "Booking Alloted succesfully",
    });
  }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//============================== booking extra amount =================================//


export async function extraAmountAdd(req: Request, res: Response) {
  const bookingId = new Types.ObjectId(req.params.id);
  const { extraAmount,reasonExtra} =
    req.body;
   
    function generateRandomString() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return result;
    }

  try {


    


const bookIng:any = await bookService.findBookById(bookingId);

if(extraAmount){

const finalCost = bookIng?.finalPrice+ parseFloat(extraAmount)

    

    const randomString = generateRandomString();
      
   
    const apiUrl = 'https://api.sumup.com/v0.1/checkouts';
    const sumupApiKey = 'sup_sk_T8xVXpu0hIJKqUfazCZ19ayDzz9PNd3yG'; // Replace with your SumUp API key
    
    const requestData = {
      checkout_reference: randomString,
      amount:parseInt(finalCost),
      currency: 'USD',
      merchant_code: 'MDFFRUA3',
      pay_to_email: 'sourav.itspark@gmail.com',
      description: 'Sample one-time payment',
    };
    
    const headers = {
      Authorization: `Bearer ${sumupApiKey}`,
      'Content-Type': 'application/json',
    };
    

   let book= await axios.post(apiUrl, requestData, { headers })
  
   const bookingDto = {
     
    extraAmount:parseFloat(extraAmount),
    checkoutId:book?.data?.id,
    reasonExtra
  };


    const books = await bookService.updateBook(bookingId, bookingDto);

    res.status(httpStatus.OK).send({
      status: true,
      message: "Booking updated succesfully",
    });
}
else{
  const bookingDto = {
     
    bookingStatus:BookingStatus.Accepted,
  };

  const book = await bookService.updateBook(bookingId, bookingDto);

  res.status(httpStatus.OK).send({
    status: true,
    message: "Booking updated succesfully",
  });
}

  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}



//============================== booking extra amount =================================//

//============================== booking cancel =================================//
export async function cancelBooking(req: Request, res: Response) {
  const bookingId = new Types.ObjectId(req.params.id);
  try {
    const bookingDto = {
      bookingStatus: BookingStatus.Cancelled,
    };

    const book = await bookService.updateBook(bookingId, bookingDto);

    res.send(httpStatus.OK).send({
      status: true,
      message: "Booking cancelled succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//============================== refund payment =================================//
export async function refundPayment(req: Request, res: Response) {
  const bookingId = new Types.ObjectId(req.params.id);
  const {amount,resaon} = req.body;
  const mybook:any = await bookService.findBookById(bookingId);
  const finalPrice = mybook?.finalPrice - parseInt(amount)
  try {
    const bookingDto = {
      finalPrice,
      paymentStatus:PaymentStatus.Refunded,
      bookingStatus:BookingStatus.Cancelled
    };
    
    const book:any = await bookService.updateBook(bookingId, bookingDto);
     const user = await authService.findUserById(book?.userId)
    sendMail(
      user?.email,
      "Booking cancelled  and payment refunded with Xactlane Chauffeur Services ",
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
           Your booking cancelled with Xactlane for following reason:
           ${resaon}
           And amount ${amount} refunded to you sucessfully.
           Sorry for inconvenient caused by us.
          </pre>
        <h4>Regards,</h4>
        <h4>Team XECTLANE</h4>
      </div>
    </body>
    
    </html>
    
      `
    );


    res.status(httpStatus.OK).send({
      status: true,
      message: "Payment refunded successfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//============================== get all bookings =================================//

export async function getAllBooking(req: Request, res: Response) {

  try {
   

    const book = await bookService.findBook();

    res.status(httpStatus.OK).send({
      status: true,
      data:book,
      message: "Booking fetched succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}