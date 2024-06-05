import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb+srv://anoop:anoop1234@cluster0.meyvhdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    console.log(`mongodb connected ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("mongoose", error);
    process.exit(1);
  }
};

export { connectDB };
