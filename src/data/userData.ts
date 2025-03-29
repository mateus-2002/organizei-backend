import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/app");
    console.log("🔥 Database connected!");
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
  }
};