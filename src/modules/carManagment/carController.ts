import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import * as carService from "./carService";

//================================= save-car =================================//

export async function saveCar(req: Request, res: Response) {
  const role = res.get("role");
  const {   vehicleType ,basePrice, hourlyPrice, distancePrice,additionalKmPrice,margin, vat, minimumDistancePerHour,minimumTimePerKm } = req.body;
  try {
    
    const data:any = req.files;
    
    if (role == "admin") {
        const imgDto: any = {
          name: data[0].originalname,
          path: data[0].path,}
      const carDto = {
        vehicleType ,basePrice, hourlyPrice, distancePrice,additionalKmPrice,margin, vat, minimumDistancePerHour ,minimumTimePerKm,
      carImg:imgDto?.path
      }
      const createdCar = await carService.saveCar(carDto);
      res.status(httpStatus.CREATED).send({
        status: true,
        data: createdCar,
        message: "Car data saved succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//================================= update-car =================================//

export async function updateCar(req: Request, res: Response) {
  const role = res.get("role");
  const { vehicleType, model, basePrice, distancePrice, hourlyPrice,_id,vat,margin,minimumDistancePerHour,carimg } = req.body;
  let data:  any= req.files;
  
  let carId = new Types.ObjectId(_id);

  try {
    if (role == "admin") {
      if(data[0]){
        const imgDto: any = {
          name: data[0].originalname,
          path: data[0].path,}
          const carDto = {
            vehicleType,
            model,
            basePrice,
            distancePrice,
            hourlyPrice,
            margin,
            minimumDistancePerHour,
            vat,
            carImg:imgDto?.path
          };
          
          const createdCar = await carService.updateCarById(carId, carDto);
          res.status(httpStatus.CREATED).send({
            status: true,
            data: createdCar,
            message: "Car data updated succesfully",
          });
      }else{
        const carDto = {
          vehicleType,
          model,
          basePrice,
          distancePrice,
          hourlyPrice,
          margin,
          minimumDistancePerHour,
          vat,
        };
        const createdCar = await carService.updateCarById(carId, carDto);
        res.status(httpStatus.CREATED).send({
          status: true,
          data: createdCar,
          message: "Car data updated succesfully",
        });
      }
    
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//================================= delete-car =================================//

export async function deleteCar(req: Request, res: Response) {
  const role = res.get("role");
  let carId = new Types.ObjectId(req.params.id);
  try {
    if (role == "admin") {
      const createdCar = await carService.deleteCarById(carId);
      res.status(httpStatus.CREATED).send({
        status: true,
        message: "Car data deleted succesfully",
      });
    } else {
      res.status(httpStatus.UNAUTHORIZED).send({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//================================= get-car =================================//

export async function getCar(req: Request, res: Response) {
  let carId = new Types.ObjectId(req.params.id);

  try {
console.log("hii");

    const car = await carService.getCarById(carId);
    res.status(httpStatus.CREATED).send({
      status: true,
      data: car,
      message: "Car data fetched succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

//================================= get-All-cars =================================//

export async function findAllCars(req: Request, res: Response) {
  try {
    const cars = await carService.getAllCars();
    res.status(httpStatus.CREATED).send({
      status: true,
      count: cars.length,
      data: cars,
      message: "Car data fetched succesfully",
    });
  } catch (error) {
    const err: Error = error as Error;
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}



