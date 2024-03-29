import express from "express";
import verify from "../../middlware/jwt.auth";
import * as bookingController from "./bookingController";

const bookingRoutes = express();

bookingRoutes.post("/create-booking",verify,bookingController.genearteBokking);

bookingRoutes.get("/cancel-booking/:id",verify,bookingController.cancelBooking);

bookingRoutes.post("/update-booking/:id",verify,bookingController.updateBooking);

bookingRoutes.get("/get-my-bookings", verify, bookingController.findMyBooking);

bookingRoutes.get("/get-book/:id", verify, bookingController.findBookingById);

bookingRoutes.post("/calculate-price",bookingController.priceCalculation);


//Past and Upcoming Bookings
bookingRoutes.get("/get-past-bookings", verify, bookingController.pastBookings);
bookingRoutes.get(
  "/get-upcoming-bookings",
  verify,
  bookingController.upcomingBookings
);
//Past and Upcoming Bookings



export default bookingRoutes;