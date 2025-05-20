import express from 'express';
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectToDatabase = async () => {
    try{
        
        const connection_instance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`, )
        console.log(`MongoDB connection successful DB Host: ${connection_instance.connection.host} DB Name: ${connection_instance.connection.name}`);

    }catch (error){
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}


export default connectToDatabase;