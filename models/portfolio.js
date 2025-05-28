// models/portfolioModel.js
const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    projectlink: {
      type: String,
      required: [true, "Project link is required"],
      trim: true,
    },
    category: {
      type: [String],
      required: [true, "Project category is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Project image is required"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
