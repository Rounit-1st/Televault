import mongoose, { mongo } from "mongoose"

export const connectToDatabase = async () => {
    // Database connection logic here
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Host: ${conn.connection.host}`)
    }
    catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1) // 1 code means exit with failure 0 means sucess
    }
};