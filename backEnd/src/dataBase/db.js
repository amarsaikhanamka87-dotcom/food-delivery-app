import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const CONNECTING_STRING = process.env.CONNECTING_STRING;

export const connectDB = async () => {
  try {
    mongoose.connect(CONNECTING_STRING);
    console.log("connection dataBase");
  } catch (err) {
    console.log("Fail");
  }
};
