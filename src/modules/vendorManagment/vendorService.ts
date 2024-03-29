import { Types } from "mongoose";
import mongoose from "mongoose";
import vandorModel from "./vandorModel";

export async function signupVandor(vandorDto: any) {
  
  return await vandorModel.create(vandorDto);
}

export async function getAllVandor() {
  return await vandorModel.find().sort({createdAt:-1});
}

export async function getVandorById(id:any) {
  return await vandorModel.findById(id)
}

export async function updateVandor(id: Types.ObjectId, vandorDto: any) {
  return await vandorModel.findByIdAndUpdate(id, vandorDto);
}

export async function deleteVandor(id: Types.ObjectId) {
  return await vandorModel.findByIdAndDelete(id);
}

export async function findSingleVandor(email: string) {
  return await vandorModel.findOne({ email });
}

export async function findVandorAndVerify(id: Types.ObjectId) {
  return await vandorModel.findByIdAndUpdate(id, { isVerified: true });
}


export async function getAllVandorByName(value: any) {
  // Use a regular expression to perform a case-insensitive search for the specified value in the 'fullname' field
  const regex = new RegExp(value, 'i');
  
  // Use the regex in the query to find vendors with matching full names
  return await vandorModel.find({ fullName: regex });
}
