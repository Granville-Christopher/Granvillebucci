const adminContact = require("../models/admincontactinfo");
const Portfolio = require("../models/portfolio");
const fs = require("fs");
// const upload = require("../middlewares/upload");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });
const Admin = require("../models/signup");
const bcrypt = require("bcrypt");
const Blog = require("../models/blog");
const crypto = require("crypto");
const sendOtpEmail = require("../config/sendotpmail")

const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ✅ Store admin info in session
    req.session.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    };
    console.log("Session after login:", req.session.admin);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

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
    const { title, description, projectlink } = req.body;
    const image = req.file?.path;
    const categories = req.body.categories;
    const categoriesArray = Array.isArray(categories)
      ? categories
      : [categories];

    if (
      !title ||
      !projectlink ||
      !categoriesArray.length ||
      !description ||
      !req.file
    ) {
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

    if (req.file) {
      updateData.image = req.file.path;
    }

    await Portfolio.findByIdAndUpdate(req.params.id, updateData);

    res.redirect("/admin/admin-portfolio");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      blogTitle,
      blogQuote,
      blogContent,
      isFeatured
    } = req.body;

    const categories = Array.isArray(req.body.category)
      ? req.body.category
      : [req.body.category];

    if (!blogTitle || !categories || !blogContent || !req.file) {
      return res.status(400).json({ message: "All fields are required including image and category." });
    }

    if (blogContent.length < 50) {
      return res.status(400).json({ message: "Content is too short." });
    }

    const newBlog = new Blog({
      blogTitle: blogTitle,
      blogQuote: blogQuote,
      blogContent: blogContent,
      categories: categories,
      isFeatured: isFeatured === "true" || isFeatured === true,
      blogImage: req.file.path,
    });

    await newBlog.save();

    res.status(200).json({ message: "Blog created successfully" });
  } catch (err) {
    console.error("❌ Blog creation error:", err);
    res.status(500).json({ message: "Server error. Try again later." });
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


// reset password config
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin with this email not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); 
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    admin.otp = { code: otp, expiresAt: otpExpires };
    await admin.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email.\ only valid in 5 minutes" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ error: "Failed to send OTP." });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.otp || !admin.otp.code) {
      return res.status(400).json({ error: "OTP not found or not requested" });
    }

    if (admin.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (admin.otp.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.otp = { code: null, expiresAt: null }; // Clear OTP after use
    await admin.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  updateAdminContactInfo,
  deleteAdminContactInfo,
  uploadPortfolio,
  editPortfolio,
  Signup,
  Login,
  createBlog,
  sendOtp,
  resetPassword,
};
