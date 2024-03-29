import { Types } from "mongoose";
import mongoose from "mongoose";
import contactUsModal from "./contactUsModal";

export async function createContact(bookDto: any) {
  
  return await contactUsModal.create(bookDto);
  
}

export async function findAllContact() {
    return await contactUsModal.find();
  }







