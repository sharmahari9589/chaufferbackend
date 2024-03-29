import { Request, Response } from "express";
import {
  generateOtp,
  generateOtpForPasswordReset,
} from "../../../utills/generateOtp";
import httpStatus from "http-status";
import { sendMail } from "../../../utills/sendMail";
import * as vandorService from "./vendorService";
import otpModel from "../authorization/otpModel";
import authroizationModel from "../authorization/authroizationModel";
//=================================Register OTP=================================//


export async function signupOtp(req: Request, res: Response) {
  try {
    let { name, email, phone, address, companyName,additonalInfo} = req.body;

    let userData = await vandorService.findSingleVandor(email);

    if (userData) {
      res.status(httpStatus.CONFLICT).send({
        status: false,
        message: "vandor already registered with this email",
      });
    } else {
      await generateOtp(email);
      res.status(httpStatus.OK).send({
        status: true,
        data: {
          name,
          email,
          phone,
          address,
          companyName,additonalInfo
        },
        message: `otp send to ${email} successfully`,
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//=================================Register with Verify Otp=================================//

export async function signUpVandor(req: Request, res: Response) {
  try {
    let { name, email, phone, address,otp,companyName,additonalInfo } = req.body;
let newOtp = parseInt(otp)


    let dataBaseOtp = await otpModel.findOne({
      email,
      otp:newOtp,
      isUsed: false,
    });

    if (!dataBaseOtp?.otp || dataBaseOtp.otp !== newOtp) {
      res.json({
        status: false,
        message: "Invalid Otp",
      });
    } else {
      let userData = await vandorService.findSingleVandor(email);

      if (userData) {
        res.status(httpStatus.CONFLICT).send({
          status: false,
          message: "user already registered with this email",
        });
      } else {
        const admin: any = await authroizationModel.findOne({ role: "admin" })
        let signUpDto = {
          fullName:name,
          email,
          phone,
          address,
          companyName,
          additonalInfo 
        };
        let data = await vandorService.signupVandor(signUpDto);
    
     await sendMail(
          email,
          "Welcome to Chauffeur Service",
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
                  <h1 style='color: green'>Chauffeur service</h1>
    <hr>
    <h4>Hello User,</h4>
    <pre style="  font-family: Arial, sans-serif;">
    Congratulations on successfully registering with Chauffeur We're delighted to have you on board.
    
    Your journey with us begins now. Once xactlane  Get Verified and Approved Your Details.Or Wait Xactlane will contact WIth You for More Deatils if Neded
    
    Get ready for an amazing experience with Chauffeur!
    
      anyone, not even if EXOAD asks you to
    </pre>
    <h4>Regards</h4>
    <h4>Team EXOAD</h4>
                  </div>
                </body>
                </html>`
        );


        await sendMail(
        admin?.email,
          "New Vendor Created",
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
                  <h1 style='color: green'>Chauffeur service</h1>
    <hr>
    <h4>Hello Admin,</h4>
    <pre style="  font-family: Arial, sans-serif;">
    Congratulations New vendor Created successfully.
    
    Get ready for an amazing experience with Chauffeur!
    
      anyone, not even if Xcactlane asks you to
    </pre>
    <h4>Regards</h4>
    <h4>Team Xcactlane</h4>
                  </div>
                </body>
                </html>`
        );


        return res.status(httpStatus.CREATED).send({
          status: true,
          message: "Successfully Registered",
          data: data,
        });
      }
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

