const adminContact = require("../models/admincontactinfo");
const Portfolio = require("../models/portfolio");
const upload = require("../middlewares/upload");
const multer = require("multer");
const updateAdminContactInfo = async (req, res) => {
  try {
    const { officeLocation, emailAddress, phoneNumber, otherInfo } = req.body;

    if (!officeLocation || !emailAddress || !phoneNumber || !otherInfo) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const contactInfo = await adminContact.findOneAndUpdate(
      {},
      { officeLocation, emailAddress, phoneNumber, otherInfo },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Contact info updated successfully", contactInfo });
  } catch (error) {
    console.error("Error updating admin contact info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadPortfolio = async (req, res) => {
  try {
    const { title, category, description, projectlink } = req.body;
    const image = req.file?.filename;
    const categories = req.body.categories;
    const categoriesArray = Array.isArray(categories)
      ? categories
      : [categories];

    if (!title || !projectlink || !categoriesArray.length || !description || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProject = new Portfolio({
      title,
      projectlink,
      category: categoriesArray,
      description,
      image,
    });

    await newProject.save();

    res
      .status(201)
      .json({ message: "Portfolio project uploaded successfully" });
  } catch (error) {
    console.error("Portfolio upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editPortfolio = async (req, res) => {
  try {
    const { title, category, description, projectlink } = req.body;
    const categoriesArray = category.split(",").map((cat) => cat.trim());

    const updateData = {
      projectlink,
      title,
      category: categoriesArray,
      description,
    };

    // If a new image was uploaded, update the image field
    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Portfolio.findByIdAndUpdate(req.params.id, updateData);

    res.redirect("/admin/admin-portfolio"); // or wherever your portfolio list is
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const deleteAdminContactInfo = async (req, res) => {
  try {
    await adminContact.deleteMany({});
    res
      .status(200)
      .json({ message: "All admin contact info deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin contact info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateAdminContactInfo,
  deleteAdminContactInfo,
  uploadPortfolio,
  editPortfolio,
};
