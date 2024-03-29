import { Types } from "mongoose";
import mongoose from "mongoose";
import carModel from "./carModel";

export async function saveCar(carDto: any) {
  return await carModel.create(carDto);
}

export async function updateCarById(id: Types.ObjectId, carDto: any) {
  
  return await carModel.findByIdAndUpdate(id, carDto);
}

export async function deleteCarById(id: Types.ObjectId) {
  return await carModel.findByIdAndDelete(id);
}

export async function getCarById(id: Types.ObjectId) {
  return await carModel.findById(id);
}

export async function getAllCars() {
  return await carModel.find().sort({createdAt:-1})
}
