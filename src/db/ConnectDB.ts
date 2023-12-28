import mongoose from 'mongoose';

const ConnectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error) {
        console.log(error);
    }
}

export default ConnectDB;