import express from "express";
import verify from "../../middlware/jwt.auth";
import * as paymentController from "./paymentController"
const paymetRoutes = express();

paymetRoutes.post("/create-payment/:id",verify,paymentController.createPayment);

paymetRoutes.post("/checkout/:id",verify,paymentController.checkout);



export default paymetRoutes;