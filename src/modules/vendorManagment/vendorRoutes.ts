import express from "express";
import * as vandorController from "./vendorController";

const vandorRoutes = express();

vandorRoutes.post("/vandor-otp", vandorController.signupOtp);

vandorRoutes.post("/register-vandor", vandorController.signUpVandor);

export default vandorRoutes;
