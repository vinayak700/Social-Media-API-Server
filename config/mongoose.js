import mongoose from 'mongoose';

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "MySocialDb",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Mongodb connection established...');
    } catch (error) {
        console.log(error);
    }
};

export default connection;