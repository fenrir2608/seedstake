import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoute from './Routes/AuthRoute.js';
import campaignRoute from "./Routes/CampaignRoute.js";
import donationRoute from "./Routes/DonationRoute.js";

dotenv.config();

const { MONGO_URL, PORT } = process.env;

const app = express();

mongoose
.connect(MONGO_URL)
.then(()=>{
    console.log("app connected to db");
    app.listen(PORT, ()=>{
        console.log(`app is listening to port: ${PORT}`);
    });
})
.catch((error)=>{
    console.log(error);
});

app.use(cors());

//app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/",authRoute);
app.use("/",campaignRoute);
app.use("/",donationRoute);
