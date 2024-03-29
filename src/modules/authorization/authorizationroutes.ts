import express from 'express';
import * as  authController from './authorizationController'
import verify from '../../middlware/jwt.auth';
import upload from "../../middlware/fileupload"

const authRoutes = express();

authRoutes.use('/public',express.static('public'))

authRoutes.post("/signup-otp",authController.signupOtp);

authRoutes.post("/signup",authController.signUp);

authRoutes.post("/login",authController.login);

authRoutes.post("/forget-password",authController.forgotPasswordGenerateOtp);

authRoutes.post("/change-password",authController.changePassword);

authRoutes.post("/verify-otp",authController.verifyOtp);

authRoutes.post("/signup-google",authController.loginWithgoogle);

authRoutes.post("/signup-facebook",authController.loginWithFacebook);

authRoutes.get("/get-profile",verify,authController.getProfile);

authRoutes.post("/update-profile",verify,upload.any(),authController.updateProfile);

authRoutes.post("/reset-password",verify,authController.resetPassword);

authRoutes.get("/logout",verify,authController.userLogout);

export default authRoutes;