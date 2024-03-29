import mongoose, { Schema, model } from "mongoose";

export interface Car extends Document {
  vehicleType: string;
  basePrice: number;
  hourlyPrice: number;
  distancePrice: number;
  additionalKmPrice:number;
  margin:number;
  vat:number;
  minimumDistancePerHour:number;
  minimumTimePerKm:number;
  carImg:string;
}

const carSchema: Schema = new Schema<Car>({
  vehicleType:  {
    type: String,
  },
  basePrice: {
    type: Number,
  },

  hourlyPrice: {
    type: Number,
  },
  distancePrice: {
    type: Number,
  },
  additionalKmPrice:{
    type:Number
  },
  margin:{
    type:Number
  },
  vat:{
    type:Number
  },
  minimumDistancePerHour:{
    type:Number
  },
  minimumTimePerKm:{
    type:Number
  },
  carImg:{type:String}

});

export default model<Car>("car", carSchema);
