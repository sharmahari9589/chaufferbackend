import express from "express";
import * as adminController from "./adminController";
import verify from "../../middlware/jwt.auth";
import upload from "../../middlware/fileupload";

const adminRoutes = express();

// user management
adminRoutes.post(
  "/update-user",
  verify,
  adminController.updateProfileById
);
adminRoutes.delete("/delete-user/:id", verify, adminController.deleteUser);
adminRoutes.get("/get-all-user", verify, adminController.getAllUser);
// user management

//  vandor managment
adminRoutes.get("/verify-vandor/:id", verify, adminController.verifyVandor);
adminRoutes.get("/get-vandor", verify, adminController.getAllVandor);
adminRoutes.get("/fetch-vandor/:id", verify, adminController.getVandorById);
adminRoutes.get("/get-vandor-name", verify, adminController.getAllVandorByName);
adminRoutes.post("/create-vandor", verify, adminController.createVandor);
adminRoutes.post("/update-vandor", verify, adminController.updateVandor);
adminRoutes.delete("/delete-vandor/:id", verify, adminController.deleteVandor);
// vandor managment

// booking allotment
adminRoutes.post("/allot-booking/:id", verify,upload.any(), adminController.alltBooking);
adminRoutes.post("/extra-amount-booking/:id", adminController.extraAmountAdd);
adminRoutes.get("/cancel-booking/:id", verify, adminController.cancelBooking);
adminRoutes.get("/get-booking",verify,adminController.getAllBooking)
// booking allotment

// payment refund
adminRoutes.post("/refund-payment/:id",verify,adminController.refundPayment)
// payment refund
export default adminRoutes;
