import mongoose, { Types, Document } from "mongoose";


export interface Otp extends Document {
  otp: number;
  
  createdAt : Date;
  expireAt : Date;
  email: string;
  expirationTime:Date;
  isUsed:Boolean;

}

const otpSchema: mongoose.Schema = new mongoose.Schema<Otp>({
  otp: {
    type: Number,
  },
  createdAt: {
    type : Date
  },
  email: {
    type: String,
    
  },
  
  expirationTime: {
    type: Date,
    
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<Otp>("otp", otpSchema);
