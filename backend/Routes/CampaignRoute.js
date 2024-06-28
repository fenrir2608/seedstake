import express from "express";
import { userVerification } from "../Middlewares/AuthMiddleware.js";
import { CreateCampaign, Dashboard, DonateCampaign, SearchCampaign, DeleteCampaign } from "../Controllers/CampaignController.js";

const campaignRouter = express.Router();

campaignRouter.get('/', userVerification, Dashboard);

// Route to create a new campaign (only accessible by admins)
campaignRouter.post('/new', userVerification, CreateCampaign);

// Route to donate to a campaign
campaignRouter.post('/campaigns/:id/donate', userVerification, DonateCampaign);

campaignRouter.get('/search/:id', userVerification, SearchCampaign);

campaignRouter.delete('/campaigns/:id', userVerification, DeleteCampaign);


export default campaignRouter;
