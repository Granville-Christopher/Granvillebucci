const express = require("express");
const router = express.Router();
const {
  deleteAdminContactInfo,
  updateAdminContactInfo,
  uploadPortfolio,
  editPortfolio,
  Signup,
  Login,
  createBlog,
  resetPassword,
  sendOtp,
} = require("../controllers/admincontroller.js");
// const upload = require("../middlewares/upload.js");
const adminContact = require("../models/admincontactinfo.js");
const Portfolio = require("../models/portfolio.js");
const Contact = require("../models/contact.js");
const Blog = require("../models/blog.js");
const multer = require("multer");
const { storage } = require("../config/cloudinary.js");
const upload = multer({ storage });

// Admin routes
router.get("/admin", (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  res.render("admin/admin", {
    title: "Granville Bucci Admin Dashboard",
  });
});

router.get("/admin-contacts", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  const userContacts = await Contact.find().sort({ createdAt: 1 });
  res.render("admin/admin-contacts", {
    contacts: userContacts,
    title: "Granville Bucci Admin Messages",
  });
});

router.get("/admin-contactinfo", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  try {
    const contactInfo = await adminContact.findOne();
    res.render("admin/admin-contactinfo", {
      contactInfo,
      title: "Granville Bucci Admin Contact Info",
    });
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/admin-portfolio", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  const portfolioItems = await Portfolio.find();
  res.render("admin/admin-portfolio", {
    portfolio: portfolioItems,
    title: "Granville Bucci Admin Portfolio",
  });
});

router.get("/editportfoliopage/:id", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  try {
    const portfolioItem = await Portfolio.findById(req.params.id).lean();
    if (!portfolioItem) {
      return res.status(404).send("Portfolio item not found");
    }

    res.render("admin/editportfoliopage", {
      title: "Granville Bucci Edit Portfolio",
      portfolioItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/editblogpage/:id", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).render("404", { title: "Blog Post Not Found" });
    }
    res.render("admin/editblogpage", {
      title: "Edit Blog Post",
      blog: blog,
    });
  } catch (error) {
    console.error("Error fetching blog post for edit:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/admin-blogs", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  const blogItems = await Blog.find();
  res.render("admin/admin-blogs", {
    blogs: blogItems,
    title: "Granville Bucci Admin Blogs",
  });
});

router.put("/blogs/:id", upload.single("blogImage"), async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  try {
    const { blogTitle, categories, blogQuote, blogContent, isFeatured } =
      req.body;
    const blogId = req.params.id;

    let updateFields = {
      blogTitle,
      blogQuote,
      blogContent,
      isFeatured: isFeatured === "true",
    };

    if (categories) {
      updateFields.categories = categories.split(",").map((cat) => cat.trim());
    } else {
      updateFields.categories = [];
    }

    if (req.file) {
      updateFields.blogImage = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    res
      .status(200)
      .json({ message: "Blog post updated successfully!", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
      error: error.message,
    });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  try {
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    res.status(200).json({ message: "Blog post deleted successfully!" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
      error: error.message,
    });
  }
});

router.get("/signup", (req, res) => {
  res.render("admin/signup", {
    title: "Granville Bucci Signup",
  });
});

router.get("/login", (req, res) => {
  res.render("admin/login", {
    title: "Granville Bucci Login",
  });
});

router.get("/forgottenpassword", (req, res) => {
  res.render("admin/forgottenpassword", {
    title: "Granville Bucci Password Reset",
  });
});

router.post("/get-otp", sendOtp);
router.post("/reset-password", resetPassword);


router.post("/adminContact", updateAdminContactInfo);
router.post("/portfolio", upload.single("image"), uploadPortfolio);
router.post("/editportfolio/:id", upload.single("image"), editPortfolio);
router.post("/api/blogs", upload.single("blogImage"), createBlog);
router.post("/api/signup", Signup);
router.post("/api/login", Login);

router.post("/deleteportfolio/:id", async (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  try {
    const id = req.params.id;
    await Portfolio.findByIdAndDelete(id);
    res.redirect("/admin/admin-portfolio");
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/logout", (req, res) => {
  if (req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return res.status(500).send("Logout failed.");
      }
      res.clearCookie("connect.sid");
      res.redirect("/admin/login");
    });
  }
});


router.delete("/adminContact/delete", deleteAdminContactInfo);
module.exports = router;
