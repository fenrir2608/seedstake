import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  targetAmount: {
    type: Number,
    required: [true, "Target amount is required"],
  },
  amountRaised: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, "Created by is required"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  campaignInfo: {
    type: Object
    // required: [true, "Campaign info is required"],
  },
  image: {
    type: String,
  },
});

// Middleware to update the updatedAt field on save
campaignSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Campaign = mongoose.model("Campaigns", campaignSchema);

export default Campaign;
