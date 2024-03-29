import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendMail } from "../../../utills/sendMail";
import * as authService from "../authorization/authorizationService";
import { Types } from "mongoose";
import * as bookingService from "./bookingService";
import { BookingStatus, PaymentStatus } from "./bookingModel";
import * as carService from "../carManagment/carService";
import { Car } from "../carManagment/carModel";
import { NotificationType } from "../notificationManagment/notificationModel";
import * as notificationController from "../notificationManagment/notificationController"
import vandorModel from "../vendorManagment/vandorModel";
import axios from 'axios';


export async function genearteBokking(req: Request, res: Response) {
  const userId = new Types.ObjectId(res.get("userId"));
  
  const { carId, bookingMode,startDate, startTime, finalPrice,duration ,from ,to,noteForChauffer ,specialReq,bookingForOther,fullName,phone,email,title,distance,time} =
    req.body;
    
// Assuming startTime is a string in the format '18:08'
let startTimeString = startTime;

// Split the time string into hours and minutes
let [hours, minutes] = startTimeString?.split(':');

// Create a new Date object with a fixed date (e.g., 2000-01-01) and the parsed hours and minutes
let startedTime = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));

// Now startTime is a valid Date object




/// generate serail number for booking
async function generateBookingId() {
  // Get current date
  const currentDate = new Date();

  // Format date as YYYYMMDD
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;

  // Generate random serial number (you can customize the range based on your needs)
let bokk = await bookingService.findBook();
let lastSerial = bokk[0]?.bookingId;
console.log(lastSerial);

let serialNumber;
if(lastSerial?.split('_')[1]==formattedDate){
   serialNumber = parseInt(lastSerial?.split('_')[2])+1;
  
}
else{
   serialNumber = 1;
}

  // Combine the elements to create the booking ID
  const bookingId = `bk_${formattedDate}_${serialNumber}`;

  return bookingId;
}

// Example usage
const randomBookingId = await generateBookingId();




/// generate serail number for booking








  try {

    function generateRandomString() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }
      return result;
    }
    


    if(bookingForOther=='someone_else'){


     
      const randomString = generateRandomString();
      
   
        const apiUrl = 'https://api.sumup.com/v0.1/checkouts';
        const sumupApiKey = 'sup_sk_T8xVXpu0hIJKqUfazCZ19ayDzz9PNd3yG'; // Replace with your SumUp API key
        
        const requestData = {
          checkout_reference: randomString,
          amount:parseInt(finalPrice),
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

      if(book?.data?.id){
        const user: any = await authService.findUserById(userId);
        const bookingDto = {
          carId,
          bookingMode,
          startTime:startedTime,
          bookingStatus: BookingStatus.Pending,
          paymentStatus:PaymentStatus.Unpiad,
          finalPrice,
          duration,
          startDate,
          bookingId:randomBookingId,
          from,
          to,
          userId,
          noteForChauffer,specialReq,
          fullName,
          phone,
          email,title,
          distance,
          time,
          checkoutId:book?.data?.id,
        };
        const booking:any = await bookingService.createBook(bookingDto);
  
       
        let admin = await authService.findAdmin();
        let adminId = admin?.map((a:any)=>{
          return a?._id
        })
  
  
        let notificationDto ={
      
          notificationTitle: 'Booking created',
          notificationDescription: `Booking created with ${user?.email} `,
          notificationBy: booking?.userId,
          notificationTo: [adminId],
          notificationType: NotificationType.BookingNotification,
      }
           notificationController.createNotification(notificationDto)
      
        sendMail(
          user?.email,
          "Booking  generated with Xactlane Chauffeur Service",
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
            Congratulations on successfully creating a booking with XactLane Chauffeur Service! We're thrilled to assist you on your journey.
          
            Your booking details are confirmed, and you will be able to pay once the booking is allotted to a chauffeur by our team.
          
            To check the status and manage your booking, please log in at http://localhost:5173/login. If you have any questions or need assistance, our support team is ready to help.
          
            Get ready for a seamless and comfortable experience with XactLane Chauffeur Service!
          
            Remember, never share your payment details with anyone, not even if XactLane asks you to.
            </pre>
              <h4>Regards</h4>
              <h4>Team Xactlane</h4>
            </div>
          </body>
          
          </html>
          `
        );
  
        res.status(httpStatus.CREATED).send({
          status: true,
          data:booking,
          message: "Booking created succesfully",
        });
  
  let vandor = await vandorModel.find();
  
  vandor.forEach((vendor, index) => {
    // Delay each email by 3 seconds
    setTimeout(() => {
      sendMail(
        vendor.email,
  `New booking from Xactlane chauffer service`,
  `<!DOCTYPE html>
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
     New booking created with chauffers service if you are avilable
     please contact with admin to 
     provide your service immidiately..
      </pre>
      <h4>Regards</h4>
      <h4>Team XactLane</h4>
    </div>
  </body>
  
  </html>
  `
  )
  }, index * 3000); // 3000 milliseconds (3 seconds) delay for each vendor
  });
  
  
      }else{
        res.status(httpStatus.CREATED).send({
          status: false,
          // data:booking,
          message: "Error in creating booking",
        });
      }
      }    



      
  else{

    const randomString = generateRandomString();
      
   
    const apiUrl = 'https://api.sumup.com/v0.1/checkouts';
    const sumupApiKey = 'sup_sk_T8xVXpu0hIJKqUfazCZ19ayDzz9PNd3yG'; // Replace with your SumUp API key
    
    const requestData = {
      checkout_reference: randomString,
      amount:parseInt(finalPrice),
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

   if(book?.data?.id){
    const user: any = await authService.findUserById(userId);
    const bookingDto = {
      carId,
      bookingMode,
      startTime:startedTime,
      bookingStatus: BookingStatus.Pending,
      paymentStatus:PaymentStatus.Unpiad,
      finalPrice,
      duration,
      from,
      startDate,
      bookingId:randomBookingId,
      to,
      userId,
      fullName,
      checkoutId:book?.data?.id,
      noteForChauffer,specialReq,bookingForOther,distance,time
    };

    const booking = await bookingService.createBook(bookingDto);

    let admin = await authService.findAdmin();
      let adminId = admin?.map((a:any)=>{
        return a?._id
      })


      let notificationDto ={
    
        notificationTitle: 'Booking created',
        notificationDescription: `Booking created with ${user?.email} `,
        notificationBy: booking?.userId,
        notificationTo: [adminId],
        notificationType: NotificationType.BookingNotification,
    }
         notificationController.createNotification(notificationDto)

    sendMail(
      user?.email,
      "Booking  crfeated with Xactlane Chauffeur Service",
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
        Congratulations on successfully creating a booking with XactLane Chauffeur Service! We're thrilled to assist you on your journey.
      
        Your booking details are confirmed, and you will be able to pay once the booking is allotted to a chauffeur by our team.
      
        To check the status and manage your booking, please log in at http://localhost:5173/login. If you have any questions or need assistance, our support team is ready to help.
      
        Get ready for a seamless and comfortable experience with XactLane Chauffeur Service!
      
        Remember, never share your payment details with anyone, not even if XactLane asks you to.
        </pre>
          <h4>Regards</h4>
          <h4>Team XactLane</h4>
        </div>
      </body>
      
      </html>`
    );
    res.status(httpStatus.CREATED).send({
      status: true,
      data:booking,
      message: "Booking created succesfully",
    });


    let vandor = await vandorModel.find();

    vandor.forEach((vendor, index) => {
      // Delay each email by 3 seconds
      setTimeout(() => {
        sendMail(
          vendor.email,
    `New booking from Xactlane chauffer service`,
    `<!DOCTYPE html>
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
       New booking created with chauffer service if you are avilable
       please contact with admin to 
       provide your service immidiately..
        </pre>
        <h4>Regards</h4>
        <h4>Team XactLane</h4>
      </div>
    </body>
    
    </html>
    `
    )
    }, index * 3000); // 3000 milliseconds (3 seconds) delay for each vendor
    });
    

  }
  else{
    res.status(httpStatus.CREATED).send({
      status: false,
      // data:booking,
      message: "Error in creating booking",
    });
  }
   }

   
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//============================== booking cancel =================================//

export async function updateBooking(req: Request, res: Response) {
  const { carId,bookingMode, startTime, finalPrice,duration ,from ,to ,paymentUrl } = req.body;

  const bookingId = new Types.ObjectId(req.params.id);
  try {
    const bookingDto = {
      carId,
      bookingMode,
      startTime,
      finalPrice,
      duration,
      from,
      to,
      bookingStatus: BookingStatus.Pending,
      paymentUrl

    };
    const isBooked = await bookingService.findBookById(bookingId);
    if (isBooked?.bookingStatus == "pending") {
      const book = await bookingService.updateBook(bookingId, bookingDto);

      res.status(httpStatus.OK).send({
        status: true,
        message: "Booking updated succesfully",
      });
    } else {
      res.status(httpStatus.OK).send({
        status: false,
        message: "You cannot update booking after accepted",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//============================== booking update =================================//

export async function cancelBooking(req: Request, res: Response) {
  const bookingId = new Types.ObjectId(req.params.id);
  try {
    const bookingDto = {
      bookingStatus: BookingStatus.Cancelled,
    };

    const book = await bookingService.updateBook(bookingId, bookingDto);

    res.status(httpStatus.OK).send({
      status: true,
      message: "Booking cancelled succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//============================== booking cancel =================================//

export async function findMyBooking(req: Request, res: Response) {
  const userId = new Types.ObjectId(res.get("userId"));
  try {
    const booking = await bookingService.findMyBook(userId);

    res.status(httpStatus.OK).send({
      status: true,
      data: booking,
      message: "Booking fetched succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//============================== price-calculation =================================//

export async function priceCalculation(req: Request, res: Response) {

  try {
    const { bookingMode, totalDistance, totalTime,duration } = req.body;
    
    const car = await carService.getAllCars()


    
    if (bookingMode == "distance") {
      const responseArray:any = []; // Initialize an array to store responses
    
      car.map((distCar) => {
        const expectedTime = distCar?.minimumTimePerKm! * totalDistance;
    
        if (totalTime > expectedTime) {
          const extraTime = totalTime - expectedTime;
    
          let totalCost = distCar?.basePrice! + distCar?.distancePrice! * totalDistance;
    
          let additionalPrice = extraTime * distCar?.hourlyPrice!;
          let newCost = totalCost + additionalPrice;
    
          let netPrice = newCost * (distCar?.margin! / 100 + 1);
    
          let finalPrice = netPrice * distCar?.vat;
    
          // Push the response object into the array
          responseArray.push({
            status: true,
            data: distCar,
            bookingMode,
            additionalPrice: additionalPrice,
            extraTime: extraTime,
            finalPrice: finalPrice,
            message: "price calculated successfully",
          });
        } else {
          let totalCost = distCar?.basePrice! + distCar?.distancePrice! * totalDistance;
    
          let netPrice = totalCost * (distCar?.margin! / 100 + 1);
    
          let finalPrice = netPrice * distCar?.vat;
    
          // Push the response object into the array
          responseArray.push({
            status: true,
            data: distCar,
            bookingMode,
            finalPrice: Number(finalPrice.toFixed(3)),
            message: "price calculated successfully",
          });
        }
      });
    
      // Send the array of responses as a single response
      res.status(httpStatus.OK).send(responseArray);
    }
    
    if (bookingMode === "time") {
      const responseArray:any = []; // Array to store individual responses
    
      car.forEach((timeCar) => {
        const expectedDistance = timeCar?.minimumDistancePerHour! * duration;
    
        let totalCost = timeCar?.basePrice! + timeCar?.hourlyPrice! * duration;
    
        if (totalDistance > expectedDistance) {
          const extraDistance = totalDistance - expectedDistance;
          let additionalPrice = extraDistance * timeCar?.distancePrice!;
          let newCost = totalCost + additionalPrice;
          let netPrice = newCost * (timeCar?.margin! / 100 + 1);
          let finalPrice = netPrice * timeCar?.vat;
    
          responseArray.push({
            status: true,
            data: timeCar,
            bookingMode,
            additionalPrice: Number(additionalPrice.toFixed(3)),
            extraDistance,
            finalPrice: Number(finalPrice.toFixed(3)),
            message: "price calculated successfully",
          });
        } else {
          let netPrice = totalCost * (timeCar?.margin! / 100 + 1);
          let finalPrice = netPrice * timeCar?.vat;
    
          responseArray.push({
            status: true,
            data: timeCar,
            bookingMode,
            finalPrice: Number(finalPrice.toFixed(3)),
            message: "price calculated successfully",
          });
        }
      });
    
      // Send the response after the loop has completed
      res.status(httpStatus.OK).send(responseArray);
    }
    
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

// ==================  find booking by id  ================================

export async function findBookingById(req: Request, res: Response) {
  const userId = new Types.ObjectId(req.params.id);
  try {
    const booking = await bookingService.findBookById(userId);

    res.status(httpStatus.OK).send({
      status: true,
      data: booking,
      message: "Booking fetched succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


// ====================================  upcoming and past booking =============

export async function upcomingBookings(req: Request, res: Response) {
  const userId = new Types.ObjectId(res.get("userId"));
  try {
    const booking = await bookingService.findMyUpcomingBookings(userId);

    res.status(httpStatus.OK).send({
      status: true,
      data: booking,
      message: "Upcoming Booking fetched succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

export async function pastBookings(req: Request, res: Response) {
  const userId = new Types.ObjectId(res.get("userId"));
  try {
    const booking = await bookingService.findMyPastBookings(userId);

    res.status(httpStatus.OK).send({
      status: true,
      data: booking,
      message: "Past Booking fetched succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}