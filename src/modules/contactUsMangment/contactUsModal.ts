import mongoose, { Document, Schema, Types, model, Mongoose } from "mongoose";


export interface ContactUs extends Document {
  fullName:string;
  email:string;
  phone:string;
  subject:string;
  msg:string;

}


const contactUsSchema: Schema = new Schema<ContactUs>(
  {
  
fullName:{
  type:String
},
email:{
  type:String
},
subject:{
  type:String
},
phone:{
  type:String
},
msg:{
    type:String
  },

  },
  {
    timestamps: true,
  }
);





export default model<ContactUs>("contactUs", contactUsSchema);
