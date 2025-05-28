const express = require("express");
const router = express.Router();
const { deleteAdminContactInfo, updateAdminContactInfo, uploadPortfolio, editPortfolio } = require('../controllers/admincontroller.js');
const upload = require("../middlewares/upload.js");
const adminContact = require('../models/admincontactinfo.js');
const Portfolio = require('../models/portfolio.js');
const Contact = require('../models/contact.js');
// Admin routes
router.get("/admin", (req, res) => {
  res.render("admin/admin", {
    title: "Granville Bucci Admin Dashboard",
  });
});

router.get("/admin-contacts", async (req, res) => {
  const userContacts = await Contact.find().sort({createdAt: 1});
  res.render("admin/admin-contacts", {
    contacts: userContacts,
    title: "Granville Bucci Admin Messages",
  });
});

router.get("/admin-contactinfo", async (req, res) => {
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

router.get("/admin-login", (req, res) => {
  res.render("admin/admin-login", {
    title: "Granville Bucci Admin login",
  });
});

router.get("/admin-signup", (req, res) => {
  res.render("admin/admin-signup", {
    title: "Granville Bucci Admin Signup",
  });
});

router.get("/admin-portfolio", async (req, res) => {
  const portfolioItems = await Portfolio.find();
  res.render("admin/admin-portfolio", {
    portfolio: portfolioItems,
    title: "Granville Bucci Admin Portfolio",
  });
});

router.get('/editportfoliopage/:id', async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id).lean(); 
    if (!portfolioItem) {
      return res.status(404).send('Portfolio item not found');
    }

    res.render('admin/editportfoliopage', {
      title: 'Granville Bucci Edit Portfolio',
      portfolioItem 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get("/admin-blogs", (req, res) => {
  res.render("admin/admin-blogs", {
    title: "Granville Bucci Admin Blogs",
  });
});

// router.post("/adminContact", postAdminContactInfo );
router.post("/adminContact", updateAdminContactInfo );
router.post("/portfolio", upload.single("image"), uploadPortfolio);
router.post('/editportfolio/:id', upload.single('image'), editPortfolio);


router.post("/deleteportfolio/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Portfolio.findByIdAndDelete(id);
    res.redirect("/admin/admin-portfolio");
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/adminContact/delete", deleteAdminContactInfo)
module.exports = router; 
