import express from 'express';
import authRoutes from './src/modules/authorization/authorizationroutes';
import carRoutes from "./src/modules/carManagment/carRoutes"
import vandorRoute from "./src/modules/vendorManagment/vendorRoutes"
import adminRoute from "./src/modules/admin/adminRoute"
import bookingRoute from "./src/modules/bookingManagment/bookingRoutes";
import paymetRoutes from "./src/modules/payment/paymentRoutes"
import notificationRoute from "./src/modules/notificationManagment/notificationRoutes"
import contactUsRoutes from "./src/modules/contactUsMangment/contactUsRoutes"
const appRoutes = express()


appRoutes.use("/api/v1",authRoutes);

appRoutes.use("/api/v1",carRoutes);

appRoutes.use('api/v1',vandorRoute);

appRoutes.use("/api/v1",adminRoute)

appRoutes.use("/api/v1",bookingRoute)

appRoutes.use("/api/v1",paymetRoutes)

appRoutes.use("/api/v1",notificationRoute)

appRoutes.use("/api/v1",contactUsRoutes)

export default appRoutes;
