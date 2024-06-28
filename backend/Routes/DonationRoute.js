import express from 'express';
import { userVerification } from '../Middlewares/AuthMiddleware.js';
import { MyCampaignDonations, MyDonations, donationDashboard, isUserCampaignOwner } from '../Controllers/DonationController.js';

const donationRouter = express.Router();

//donations for campaigns created by the admin
donationRouter.get('/campaignDonations', userVerification, MyCampaignDonations);

//donations made by the current user
donationRouter.get('/myDonations', userVerification, MyDonations);

//is user a campaign owner
donationRouter.get('/campaigns/:campaignId/isOwner', userVerification, isUserCampaignOwner);

//donation dashboard
donationRouter.get('/donations', userVerification, donationDashboard);

export default donationRouter;
