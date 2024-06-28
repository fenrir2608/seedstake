import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, "User ID is required"],
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaigns',
    required: [true, "Campaign ID is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  donationDate: {
    type: Date,
    default: new Date(),
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  }
});

const Donation = mongoose.model("Donations", donationSchema);

export default Donation;
