import express from "express";
import verify from "../../middlware/jwt.auth";
import * as carController from "./carController";
import upload from "../../middlware/fileupload";
const carRoutes = express();
carRoutes.use('/public',express.static('public'))

carRoutes.get("/get-car-details/:id", carController.getCar);

carRoutes.get("/get-all-cars", carController.findAllCars);

carRoutes.post("/save-car", verify,upload.any(), carController.saveCar);

carRoutes.post("/update-car", verify,upload.any(), carController.updateCar);

carRoutes.delete("/delete-car/:id", verify, carController.deleteCar);


export default carRoutes;
