import dotenv from 'dotenv';
dotenv.config();

import * as mongoose from 'mongoose';

export default async () => {
    const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_NAME}.9ezg1yl.mongodb.net/?retryWrites=true&w=majority`;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    try {
        await mongoose.connect(uri, options);
        console.log('MongoDB Connected');
    } catch (err: any) {
        console.log('MongoDB Connection Failed: ', err.message);
    }
};
