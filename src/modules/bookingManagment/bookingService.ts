import { Types } from "mongoose";
import mongoose from "mongoose";
import bookingModel from "./bookingModel";

export async function createBook(bookDto: any) {
  
  return await bookingModel.create(bookDto);
    
 
  
}

export async function updateBook(id: Types.ObjectId, bookDto: any) {
  return await bookingModel.findByIdAndUpdate(id, bookDto);
}

export async function findBookById(id: Types.ObjectId) {
  return await bookingModel.findById(id);
}

export async function findBook() {
  return await bookingModel.aggregate(
    [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'vandors',
          localField: 'allocateVandorId',
          foreignField: '_id',
          as: 'vandor'
        }
      },
      {
        $unwind: {
          path: '$vandor',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: {

          // Add your sorting criteria here
          // Assuming you want to sort by a field named 'fieldName' in ascending order
          'createdAt': -1
        }
      }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  );
}

export async function findMyBook(id: Types.ObjectId) {
  return await bookingModel.find({userId:id});
}



export async function findMyUpcomingBookings(id: Types.ObjectId) {
  const currentDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000+00:00';

  return await bookingModel.find({
    userId: id,
    startDate: { $gte: currentDate },
  }).sort({createdAt:-1});
}

export async function findMyPastBookings(id: Types.ObjectId) {
  const currentDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000+00:00';
  return await bookingModel.find({
    userId: id,
    startDate: { $lt: currentDate },
  }).sort({createdAt:-1});
}