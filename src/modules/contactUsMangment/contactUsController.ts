import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendMail } from "../../../utills/sendMail";
import * as authService from "../authorization/authorizationService";
import { Types } from "mongoose";
import * as carService from "../carManagment/carService";
import * as contactUsService from './contactUsService'
import { Car } from "../carManagment/carModel";
import authroizationModel from "../authorization/authroizationModel";

export async function createContactUS(req: Request, res: Response) {

    try {

        const userId = new Types.ObjectId(res.get("userId"));

        const admin: any = await authroizationModel.findOne({ role: "admin" })

        const { fullName, phone, email, msg, subject } =
            req.body;

        const contactUSDto = {

            fullName,
            email,
            msg,
            subject,
            phone

        };

        const contact = await contactUsService.createContact(contactUSDto);


        await sendMail(
            admin?.email,
            `${subject}`,
            `
     <!DOCTYPE html>
         <html>
         <head>
           <style>
             / Inline CSS for styling /
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
             }
             / Add more inline styles as needed /
           </style>
         </head>
         <body>
           <div class="container">
           <h1 style='color: Green'>Chauffeur Services</h1>
<hr>
<h4>Hello Admin,</h4>
<pre style="  font-family: Arial, sans-serif;">

${msg}



Email :${email}

 Contact No:${phone}
</pre>
<h4>Regards</h4>
<h4>${fullName}</h4>
           </div>
         </body>
         </html>`
        );
        res.status(httpStatus.CREATED).send({
            status: true,
            data: contact,
            message: "Booking created succesfully",
        });

    } catch (error) {
        const err: Error = error as Error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}




//============================== booking Get =================================//

export async function findAllContactUs(req: Request, res: Response) {
    const userId = new Types.ObjectId(res.get("userId"));
    try {
        const getContact = await contactUsService.findAllContact();

        res.send(httpStatus.OK).send({
            status: true,
            data: getContact,
            message: "Booking fetched succesfully",
        });
    } catch (error) {
        const err: Error = error as Error;
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}





// Create Query for admin by User

export async function createQuery(req: Request, res: Response) {

  try {
      const userId = new Types.ObjectId(res.get("userId"));
      const admin: any = await authroizationModel.findOne({ role: "admin" })

      const { fullName,queryType,ExistingCustomer, phone, email } =
          req.body;

      await sendMail(
          admin?.email,
          `Query realted Issues`,
          `
   <!DOCTYPE html>
       <html>
       <head>
         <style>
           / Inline CSS for styling /
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
           }
           / Add more inline styles as needed /
         </style>
       </head>
       <body>
         <div class="container">
         <h1 style='color: Green'>Chauffeur Services</h1>
<hr>
<h4>Hello Admin,</h4>
<pre style="  font-family: Arial, sans-serif;">

Query :${queryType}

ExistingCustomer:${ExistingCustomer}

Email :${email}

Contact No:${phone}
</pre>
<h4>Regards</h4>
<h4>${fullName}</h4>
         </div>
       </body>
       </html>`
      );
      res.status(httpStatus.CREATED).send({
          status: true,
          data: "Query Submitted Successfully",
          message: "Query Submitted Successfully",
      });

  } catch (error) {
      const err: Error = error as Error;
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//==========================================  shuttlesevice ======================//

export async function shuttleService(req: Request, res: Response) {

  try {


      const admin: any = await authroizationModel.findOne({ role: "admin" })

      const { fullName, phone, email, msg } =
          req.body;

      await sendMail(
          admin?.email,
          `RRequest for shuttle sevice`,
          `
   <!DOCTYPE html>
       <html>
       <head>
         <style>
           / Inline CSS for styling /
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
           }
           / Add more inline styles as needed /
         </style>
       </head>
       <body>
         <div class="container">
         <h1 style='color: Green'>Chauffeur Services</h1>
<hr>
<h4>Hello Admin,</h4>
<pre style="  font-family: Arial, sans-serif;">

${msg}



Email :${email}

Contact No:${phone}
</pre>
<h4>Regards</h4>
<h4>${fullName}</h4>
         </div>
       </body>
       </html>`
      );
      res.status(httpStatus.CREATED).send({
          status: true,
          message: "Booking created succesfully",
      });

  } catch (error) {
      const err: Error = error as Error;
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}



