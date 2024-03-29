import express from "express";
import verify from "../../middlware/jwt.auth";
import * as contactUsController from "./contactUsController";

const contactUsRoutes = express();


// Create 
contactUsRoutes.post("/create-contact-us",verify,contactUsController.createContactUS);

// Get
contactUsRoutes.get("/get-contact-us", verify, contactUsController.findAllContactUs);


// Create Query
contactUsRoutes.post("/create-query",verify,contactUsController.createQuery);


contactUsRoutes.post("/request-shuttle",contactUsController.shuttleService);


export default contactUsRoutes;