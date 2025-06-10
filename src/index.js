import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectToDatabase from "./db/index.js";
import dotenv from "dotenv";
import { app } from './app.js';


dotenv.config({
    path: "./.env",
});

connectToDatabase()
    .then(() => {
        console.log("Connected to MongoDB");

        app.on("error", (err) => {
            console.error("Error occurred while connecting to port:", err);
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
;