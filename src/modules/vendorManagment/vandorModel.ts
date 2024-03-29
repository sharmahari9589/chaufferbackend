import mongoose, { Schema, model } from "mongoose";

export interface Vandor extends Document {
  fullName: string;
  email: string;
  address: string;
  zipCode: string;
  companyName: string;
  additonalInfo : string;
  phone: string;
  isVerified: boolean;
}

const vandorSchema: Schema = new Schema<Vandor>(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
    },

    phone: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    companyName: {
      type: String,
    },
    additonalInfo: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Vandor>("vandor", vandorSchema);
