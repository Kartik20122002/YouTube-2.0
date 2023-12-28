import mongoose from 'mongoose';
import { config } from 'dotenv'

config();

const ConnectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI as string
        const connection = await mongoose.connect(uri);
    } catch (error) {
        console.log(error);
    }
}

export default ConnectDB;