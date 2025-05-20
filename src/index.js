import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectToDatabase from "./db/index.js";
import dotenv from "dotenv";
const app = express();


dotenv.config({
    path: "./.env",
});

connectToDatabase();