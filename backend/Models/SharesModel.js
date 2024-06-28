import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
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
  stakePercentage: {
    type: Number,
    required: [true, "Stake percentage is required"],
  },
  investmentAmount: {
    type: Number,
    required: [true, "Investment amount is required"],
  },
  investmentDate: {
    type: Date,
    default: new Date(),
  }
});

const Share = mongoose.model("Shares", shareSchema);

export default Share;
