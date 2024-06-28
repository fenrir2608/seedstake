import Donation from '../Models/DonationModel.js';
import Campaign from '../Models/CampaignModel.js';
import User from '../Models/UserModel.js';

export const MyCampaignDonations = async (req, res) => {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Find campaigns created by the admin
      const adminCampaigns = await Campaign.find({ createdBy: req.user._id });
  
      // Extract campaignIds from adminCampaigns
      const campaignIds = adminCampaigns.map(campaign => campaign._id);
  
      // Find donations where campaignId is in the list of campaignIds
      const donations = await Donation.find({ campaignId: { $in: campaignIds } });
  
      res.status(200).json(donations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
    }
  }


export const MyDonations = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Find donations where userId matches the current user's _id
      const donations = await Donation.find({ userId });
  
      res.status(200).json(donations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
    }
  }

  export const isUserCampaignOwner = async (req, res) => {
    const { campaignId } = req.params; // Assuming campaignId is passed as a parameter
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      const isOwner = campaign.createdBy.toString() === req.user._id.toString();
      res.json({ isOwner });
    } catch (error) {
      console.error('Error checking campaign ownership:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  export const donationDashboard = async (req, res) => {
    try {
      // Retrieve admin campaigns
      const adminCampaigns = await Campaign.find({ createdBy: req.user._id });
      const admin = await User.findOne({ _id: req.user._id }).select('username');
      const adminUsername = admin.username;

      // Extract campaign IDs
      const adminCampaignIds = adminCampaigns.map(campaign => campaign._id);
  
    // Calculate anonymous donations amount and count for admin campaigns
    const anonymousDonations = await Donation.aggregate([
      { $match: { isAnonymous: true, campaignId: { $in: adminCampaignIds } } }, // Match donations where isAnonymous is true and campaignId is in adminCampaignIds
      { 
        $group: { 
          _id: null, 
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 } // Count the number of anonymous donations
        } 
      },
    ]);

    // Extract the total anonymous donation amount and count from the aggregation result
    const anonymousDonationsAmount = anonymousDonations.length > 0 ? anonymousDonations[0].totalAmount : 0;
    const anonymousDonationsCount = anonymousDonations.length > 0 ? anonymousDonations[0].count : 0;
    
    // Calculate total donation count for admin campaigns
    const totalDonations = await Donation.aggregate([
      { $match: { campaignId: { $in: adminCampaignIds } } }, // Match donations where campaignId is in adminCampaignIds
      { 
        $group: { 
          _id: null, 
          count: { $sum: 1 } // Count the number of donations
        } 
      },
    ]);

    // Extract the total donation count from the aggregation result
    const totalDonationsCount = totalDonations.length > 0 ? totalDonations[0].count : 0;


      // Calculate total raised amount and other metrics for admin campaigns
      const campaignsData = await Promise.all(adminCampaigns.map(async (campaign) => {
        // Aggregate total raised amount for each campaign
        const totalRaised = await Donation.aggregate([
          { $match: { campaignId: campaign._id } },
          { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);
  
      // Aggregate average donation amount for each campaign
      const avgDonation = await Donation.aggregate([
        { $match: { campaignId: campaign._id } },
        { $group: { _id: null, avgAmount: { $avg: "$amount" } } },
      ]);


        // Count the number of donations for each campaign
        const donationsCount = await Donation.countDocuments({ campaignId: campaign._id });

         // Count the number of anonymous donations for each campaign
      const anonymousDonationsCountPerCampaign = await Donation.countDocuments({ campaignId: campaign._id, isAnonymous: true });
  
        // Calculate total raised amount and percentage of the target amount raised
        const totalRaisedAmount = totalRaised.length > 0 ? totalRaised[0].totalAmount : 0;
        const percentageRaised = (totalRaisedAmount / campaign.targetAmount) * 100;
        const avgDonationAmount = avgDonation.length > 0 ? avgDonation[0].avgAmount : 0;
  
        return {
          ...campaign.toObject(),
          totalRaisedAmount,
          percentageRaised,
          anonymousDonationsCountPerCampaign,
          donationsCount,
          avgDonationAmount
        };
      }));
  
      // List donors who donated to admin's campaigns
      const donors = await Donation.aggregate([
        { $match: { campaignId: { $in: adminCampaignIds } } }, // Match donations where campaignId is in adminCampaignIds
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $project: {
            amount: 1,
            donationDate: 1,
            isAnonymous: 1,
            user: { $arrayElemAt: ['$userDetails', 0] },
          },
        },
        {
          $project: {
            amount: 1,
            donationDate: 1,
            isAnonymous: 1,
            donorName: {
              $cond: { if: { $eq: ['$isAnonymous', true] }, then: 'Anonymous', else: '$user.username' },
            },
          },
        },
      ]);
      // Send response
      res.status(200).json({
        adminUsername,
        totalDonationsCount,
        anonymousDonationsCount,
        anonymousDonationsAmount,
        adminCampaigns: campaignsData,
        totalRaised: campaignsData.reduce((acc, campaign) => acc + campaign.totalRaisedAmount, 0),
        donorsList: donors,
      });
    } catch (error) {
      console.error('Error fetching donation dashboard data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };