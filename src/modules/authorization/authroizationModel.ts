import { string } from 'joi';
import mongoose, { Schema, model } from 'mongoose';



export interface User extends Document{


    fullName: string;
    email: string;
    password: string;
    address:string;
    zipCode:string;
    phone: string;
    imgPath:string;
    role:string;
    dateOfBirth:Date;
title:string

}


const userSchema: Schema = new Schema<User>({

    fullName:{

        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    address:{
        type:String
    },
    zipCode:{
        type:String
    },
    imgPath:{
        type:String
    },

    phone:{
        type:String
    },
    dateOfBirth:{
        type:Date
    },
    role:{
        type:String,
        default:"user"
    },
    title:{
        type:String
    }
   
},{
    timestamps:true
})


export default model<User>("user", userSchema);






