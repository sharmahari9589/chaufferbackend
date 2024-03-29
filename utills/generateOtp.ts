import moment from "moment";
import otpModel from "../src/modules/authorization/otpModel"
import { sendMail } from "./sendMail";


export const generateOtp = async (email: any) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP


  const expirationTime = moment().add(5, 'minutes'); // OTP expiration time

  let dataBaseOtp = await otpModel.findOne({ email });


  if (dataBaseOtp) {
    await otpModel.findOneAndUpdate({email}, {

      email,
      otp,
      createdAt: Date.now(),
      isUsed: false,
    })
  }
  else {
    const newOTP = new otpModel({

      email,
      otp,
      createdAt: Date.now(),
      isUsed: false,
    });
    await newOTP.save();

  }

  let data = await sendMail(
    email,
    "Verify your with otp for register with XACTLANE",
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
          color: #3498db; /* Change color to Xactalane's brand color */
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
          Thank you for choosing Xactalane. Use this
          OTP to complete your registration process
          and verify your account on Xactalane.
          Remember, never share this OTP with
          anyone, not even if Xactalane asks you to.
        </pre>
        <h3 >${otp}</h3>
        <h4>Regards</h4>
        <h4>Team Xactalane Chauffeur Service</h4>
      </div>
    </body>
    </html>
    
            `

  )
};




export const generateOtpForPasswordReset = async (email: any) => {
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 6-digit OTP


  const expirationTime = moment().add(5, 'minutes'); // OTP expiration time

  let dataBaseOtp = await otpModel.findOne({ email });


  if (dataBaseOtp) {
    await otpModel.findOneAndUpdate({email}, {

      email,
      otp,
      createdAt: Date.now(),
      isUsed: false,
    })
  }
  else {
    const newOTP = new otpModel({

      email,
      otp,
      createdAt: Date.now(),
      isUsed: false,
    });
    await newOTP.save();

  }

  let data = await sendMail(
    email,
    "Verify Your email with otp to cahnge password",
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
          color: #2ecc71; /* Change color to Xactlene's brand color */
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
          Please enter the OTP below in your app to 
          change your password.
        </pre>
        <h3 >${otp}</h3>
        <h4>Regards</h4>
        <h4>Team Xactlene Chauffeur Service</h4>
      </div>
    </body>
    </html>
    
      `

  )
};

