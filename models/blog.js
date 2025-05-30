const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    blogQuote: {
      type: String,
      default: "",
    },
    blogContent: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
