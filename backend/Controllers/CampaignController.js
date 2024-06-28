import Campaign from "../Models/CampaignModel.js";
import Donation from "../Models/DonationModel.js";
import cloudinary from '../utils/Cloudinary.js';
import upload from '../Middlewares/Multer.js';

  export const Dashboard = async (req, res) => {
      const allCampaigns = await Campaign.find({ isActive: true });
      if (req.isAdmin) {
        const adminCampaigns = await Campaign.find({ createdBy: req.user._id });
        res.json({ status:true,id:req.user._id,user:req.user.username,isAdmin:req.user.isAdmin, adminCampaigns, allCampaigns });
      } else {
        res.json({ status:true,user:req.user.username, allCampaigns });
      }
    }

    export const CreateCampaign = [
      upload.single('image'),
      async (req, res) => {
        if (!req.isAdmin) {
          return res.status(403).json({ message: 'Access denied' });
        }
    
        const { title, description, targetAmount, startDate, endDate, campaignInfo } = req.body;
    
        try {
          // Upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
    
          const newCampaign = new Campaign({
            title,
            description,
            targetAmount,
            amountRaised: 0,
            startDate,
            endDate,
            createdBy: req.user._id,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            campaignInfo,
            image: result.secure_url
          });
    
          await newCampaign.save();
          res.status(201).json(newCampaign);
        } catch (error) {
          console.error('Error creating campaign:', error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
    ];

export const DonateCampaign = async (req, res) => {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
  
    if (req.isAdmin && campaign.createdBy.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'Admin cannot donate to their own campaign' });
    }
  
    const donation = new Donation({
      userId: req.user._id,
      campaignId: req.params.id,    
      amount: req.body.amount,
      donationDate: new Date(),
      isAnonymous: req.body.isAnonymous || false
    });
    await donation.save();
  
    // Update the campaign's amountRaised
    campaign.amountRaised += req.body.amount;
    await campaign.save();
  
    res.status(201).json(donation);
  }

  export const SearchCampaign = async (req, res) => {
    try {
      const campaignId = req.params.id;
  
      if (!campaignId) {
        return res.status(400).json({ message: 'Campaign ID is required' });
      }
  
      const campaign = await Campaign.findById(campaignId);
  
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
  
      res.status(200).json(campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  export const DeleteCampaign = async (req, res) => {
    try {
      const { id } = req.params;
      await Campaign.findByIdAndDelete(id);
      res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting campaign', error });
    }
  }