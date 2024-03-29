import { Request, Response } from "express";
import * as authService from './authorizationService';
import { generateOtp, generateOtpForPasswordReset } from "../../../utills/generateOtp"
import httpStatus from "http-status";
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import otpModel from "./otpModel";
import { sendMail } from "../../../utills/sendMail";
import { Types } from "mongoose";
import { User } from "./authroizationModel";
import * as notificationController from "../notificationManagment/notificationController"
import { NotificationType } from "../notificationManagment/notificationModel";

//=================================RegisterOTP=================================//

export async function signupOtp(req: Request, res: Response) {
  try {
    let { fullName, email, phone, password, confirmPassword } = req.body;

    let userData = await authService.findSingleUser(email);

    if (userData) {
      res.status(httpStatus.CONFLICT).send({
        status: false,
        message: "user already registered with this email",
      });
    } else {

      if (password == confirmPassword) {
        await generateOtp(email);

        res.status(httpStatus.OK).send({
          status: true,
          data: {
            fullName,
            email,
            password,
            phone
          },
          message: `otp send to ${email} successfully`,
        });
      }
      else {
        res.status(httpStatus.NOT_FOUND).send({
          status: false,
          message: "password and confirmPassword are mismatched"
        })
      }

    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//=================================Register with Verify Otp=================================//

export async function signUp(req: Request, res: Response) {
  try {
    let { fullName, email, phone, password, otp, role, title } = req.body;

    let newOTP = Number(otp);

    let dataBaseOtp = await otpModel.findOne({
      email,
      otp: newOTP,
      isUsed: false,
    });

    if (!dataBaseOtp?.otp || dataBaseOtp.otp !== newOTP) {
      res.json({
        status: false,
        message: "Invalid Otp",
      });
    } else {
      let userData = await authService.findSingleUser(email);

      if (userData) {
        res.status(httpStatus.CONFLICT).send({
          status: false,
          message: "user already registered with this email",
        });
      } else {
        let encryptedPassword = await bcrypt.hash(password, 8);
        password = encryptedPassword;
        let signUpDto = {
          fullName: fullName,
          email: email,
          phone: phone,
          password: password,
          role: role,
          title,
        };
        let data = await authService.signupUser(signUpDto);
        let admin = await authService.findAdmin();
          let adminId = admin?.map((a:any)=>{
            return a?._id
          })

  let notificationDto ={
    
      notificationTitle: 'Register User',
      notificationDescription: `User ${email} registered`,
      notificationBy: data?._id,
      notificationTo: [adminId],
      notificationType: NotificationType.registerNotification,
  }
       notificationController.createNotification(notificationDto)

        sendMail(
          email,
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
              <h1>XACTLANE Chauffeur Service</h1>
              <hr>
              <h4>Hello User,</h4>
              <pre style="font-family: Arial, sans-serif;">
              Congratulations on successfully registering with XACTLANE Chauffeur Service! We're delighted to have you on board.
          
              Your journey with us begins now. Please log in <a href="http://localhost:5173/login" style="color: blue;">here</a> to explore all the incredible features we have to offer. Should you need any assistance or have questions, our support team is here to help.
          
              Get ready for an amazing experience with XCTALNE Chauffeur Service!
          
              Remember, never share your login details with anyone, not even if XACTLANE Chauffeur Service asks you to.
              </pre>
              <h4>Regards</h4>
              <h4>Team XCTALNE Chauffeur Service</h4>
            </div>
          </body>
          </html>
          `
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
//=================================Login User=================================//

export async function login(req: Request, res: Response) {
  try {
    let { email, password } = req.body;
    

    let user: any = await authService.loginUser(email as string, password as string)
    

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ status: false, message: "User not found" });
    } else {
      let comparePassword: boolean = bcrypt.compareSync(password, user.password)

      if (comparePassword == false) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ status: false, message: "Incorrect Credential" });
      }
      else {
        const token: string = jwt.sign({ "userId": user?._id, "role": user.role }, process.env.JWT_SECRET!,
          { expiresIn: process.env.JWT_EXPIRATION! });

        user = await authService.findUserById(user._id)


        return res.status(httpStatus.OK).send({
          status: true,
          message: "User logged in successfully",
          data: user,
          token: token
        });
      }
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//=================================Get User Details=================================//

export async function getProfile(req: Request, res: Response) {
  let userId = new Types.ObjectId(res.get("userId"));
  
  try {

    let user = await authService.findUserById(userId);
    if (!user) {
      res.status(httpStatus.NOT_FOUND).send({
        status: false,
        message: "User not found"
      })
    } else {

      res.status(httpStatus.OK).send({
        status: true,
        data: user,
        message: "User fetched succesfully"
      })

    }

  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//=================================forgot-password Otp send=================================//

export async function forgotPasswordGenerateOtp(req: Request, res: Response) {
  try {
    let { email } = req.body;

    let isUserExist = await authService.findSingleUser(email);
    if (!isUserExist) {
      res.status(httpStatus.NOT_FOUND).send(
        {
          status: false,
          message: "User not registered with us"
        }
      )
    }
    else {
      await generateOtpForPasswordReset(email);
      res.status(httpStatus.OK).send(
        {
          status: true,
          email,
          message: `otp send to ${email} successfully`
        }
      )
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//=================================forgot-password Otp Verify and change password=================================//

export async function changePassword(req: Request, res: Response) {
  try {
    let { email, otp, password, confirmPassword } = req.body;

    
      if (password == confirmPassword) {
        let encryptedPassword = await bcrypt.hash(password, 8);
        password = encryptedPassword;
        await authService.findUserAndUpdate(email, password);

        res.status(httpStatus.CREATED).send({
          status: true,
          message: "Password changed succesfully"
        })
      }
      else {
        res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          message: "Password and confirmed password not matched"
        })
      }
    

  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


export async function verifyOtp(req: Request, res: Response) {
  try {
    let { email, otp } = req.body;

    let dataBaseOtp = await otpModel.findOne({
      email,
      otp,
      isUsed: false,
    });

    if (!dataBaseOtp?.otp || dataBaseOtp.otp !== otp) {
      res.json({
        status: false,
        message: "Invalid Otp",
      });
    } else {
     res.status(httpStatus.OK).send({
      status:true,
      email,
      otp,
      message:"otp matched"
     })
    }

  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//=================================Reset- password=================================//

export async function resetPassword(req: Request, res: Response) {
  let userId = new Types.ObjectId(res.get("userId"));
  let { currentPassword, newPassword, confirmPassword } = req.body;
  let user: any = await authService.findUserById(userId);
  try {
    let comparePassword: boolean = bcrypt.compareSync(currentPassword, user?.password);
    if (comparePassword == false) {
      res.status(httpStatus.BAD_REQUEST).send({
        status: false,
        message: "Invalid current password"
      })
    }
    else {
      if (newPassword == confirmPassword) {
        let encryptedPassword = await bcrypt.hash(newPassword, 8);
        newPassword = encryptedPassword;
        await authService.findUserAndUpdate(user.email, newPassword);

        res.status(httpStatus.CREATED).send({
          status: true,
          message: "Passwword changed succesfully"
        })
      } else {
        res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          message: "Password and confirmed password not matched"
        })
      }
    }

  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//=================================update-profile=================================//

export async function updateProfile(req: Request, res: Response) {
  let userId = new Types.ObjectId(res.get("userId"));

  let { fullName, email, phone,address,zipCode,dateOfBirth } = req.body;
  
  
  const data: any = req.files;
  
  let user = await authService.findUserById(userId);
 
  try {
if(data[0]){
  const imgDto: any = {
    name: data[0].originalname,
    path: data[0].path,
  };

  let userDto = {
    fullName,
    email,
    phone,
    address,
    zipCode,
    imgPath:imgDto.path,
    dateOfBirth
  }
  await authService.findUserAndUpdateProfile(userId, userDto);
  res.status(httpStatus.CREATED).send({
    status: true,
    message: "Profile upadted succesfully"
  })
}
else{
  let userDto = {
    fullName,
    email,
    phone,
    address,
    zipCode,
    dateOfBirth
  }
  await authService.findUserAndUpdateProfile(userId, userDto);
  res.status(httpStatus.CREATED).send({
    status: true,
    message: "Profile upadted succesfully"
  })
}
    
    
   
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//===============================login with google =====================================//

export async function loginWithgoogle(req: Request, res: Response) {
  try {
    let { name, email } = req.body;
    let user: any = await authService.findSingleUser(email);

    if (user) {
      const token: string = jwt.sign({ "userId": user?._id, "role": user.role }, process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRATION! });

      user = await authService.findUserById(user._id)

      return res.status(httpStatus.OK).send({
        status: true,
        message: "User logged in successfully",
        data: user,
        token: token
      });
    }
    else {
      let userDto = {
        name,
        email
      }
      let user: any = await authService.signupUser(userDto);

      if (user) {
        const token: string = jwt.sign({ "userId": user?._id, "role": user.role }, process.env.JWT_SECRET!,
          { expiresIn: process.env.JWT_EXPIRATION! });

        user = await authService.findUserById(user._id)

        return res.status(httpStatus.OK).send({
          status: true,
          message: "User logged in successfully",
          data: user,
          token: token
        });
      }
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//===============================login with facebook =====================================//

export async function loginWithFacebook(req: Request, res: Response) {
  try {
    let { name, email } = req.body;

    let user: any = await authService.findSingleUser(email);
    if (user) {
      const token: string = jwt.sign({ "userId": user?._id, "role": user.role }, process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRATION! });

      user = await authService.findUserById(user._id)

      return res.status(httpStatus.OK).send({
        status: true,
        message: "User logged in successfully",
        data: user,
        token: token
      });
    }

    else {
      let userDto = {
        name,
        email
      }
      let user: any = await authService.signupUser(userDto);

      if (user) {
        const token: string = jwt.sign({ "userId": user?._id, "role": user.role }, process.env.JWT_SECRET!,
          { expiresIn: process.env.JWT_EXPIRATION! });

        user = await authService.findUserById(user._id)

        return res.status(httpStatus.OK).send({
          status: true,
          message: "User logged in successfully",
          data: user,
          token: token
        });
      }
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}


//============================Logout==============================//

export async function userLogout(req: Request, res: Response) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;

   const tokenBlacklist: string[] = [];
    const token = req.headers.authorization?.split(' ')[1] || req.cookies['token'];

    if (!token) {
      return res.status(httpStatus.OK).send({ 
        status:true,
        message: "User already logged out"
       });
    }

    if (tokenBlacklist.includes(token)) {
      return res.status(httpStatus.UNAUTHORIZED).send({ 
        status:true,
        message: "Token has already been invalidated" 
      });
    }
    const decodedToken: any = jwt.verify(token, JWT_SECRET);

    tokenBlacklist.push(token);

    res.clearCookie('token');

    return res.status(httpStatus.OK).send({
      status:true,
      message: "User logout" 
    });
  } catch (error) {
    const err: Error = error as Error;
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}
