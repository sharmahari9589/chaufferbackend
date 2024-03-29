import { Types } from "mongoose";
import authroizationModel, { User } from "./authroizationModel";
import mongoose from "mongoose";

export async function signupUser(userDto:any) {

    return await authroizationModel.create(userDto)
    
}

export async function findUserAndUpdateProfile(id:Types.ObjectId,Dto:any) {

    return await authroizationModel.findByIdAndUpdate(id,Dto)
    
}

export async function findUserAndDelete(id:Types.ObjectId) {

    return await authroizationModel.findByIdAndDelete(id)
    
}

export async function findUser(email:string) {

    return await authroizationModel.find({email})
    
}

export async function findAllUser() {

    return await authroizationModel.find({role:"user"}).sort({createdAt:-1})
    
}


export async function findAdmin() {

    return await authroizationModel.find({role:"admin"})
    
}

export async function findUserById(id:Types.ObjectId){
    return await authroizationModel.findById(id)

}

export async function findSingleUser(email:string) {

    return await authroizationModel.findOne({email})
    
}

export async function findUserAndUpdate(email:string,password:string) {
    return await authroizationModel.findOneAndUpdate({email},{password})
    
}

export async function loginUser(email: string,password: string){
    return await authroizationModel.findOne({email},{otp:false, expireIn:false, token:false})

}