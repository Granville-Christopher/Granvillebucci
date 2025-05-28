const express = require("express");
const router = express.Router();
const { testimonyUpload,  contactBucci } = require('../controllers/basiccontroller.js');
const upload = require("../middlewares/upload.js");
const Testimony = require('../models/testimony.js');
const adminContact = require('../models/admincontactinfo.js');
const Portfolio = require('../models/portfolio.js');
// Homepage
router.get("/", async (req, res) => {

  const testimonies = await Testimony.find().sort({ createdAt: -1 }).limit(5);
  const contactinfo = await adminContact.findOne();
  res.render("user/index", {
    title: "Granville Bucci",
    page: "index",
    loaded: "index",
    testimonies: testimonies,
    contactinfo
  });
});

router.post("/testimony", upload.single("image"), testimonyUpload);
router.post("/contact", contactBucci);


// Portfolio page
router.get("/portfolio", async (req, res) => {
  const contactinfo = await adminContact.findOne();
  const portfolioItems = await Portfolio.find();

  res.render("user/portfolio", {
    contactinfo,
    portfolio: portfolioItems,
    title: "Granville Bucci / Portfolio",
    page: "portfolio",
    loaded: "portfolio"
  });
});

// Blog page
router.get("/blog", async (req, res) => {
  const contactinfo = await adminContact.findOne();
  res.render("user/blog", {
    contactinfo,
    title: "Granville Bucci / Blog",
    page: "blog",
    loaded: "blog"
  });
});
router.get("/blogsingle", async (req, res) => {
  const contactinfo = await adminContact.findOne();
  res.render("user/blogsingle", {
    contactinfo,
    title: "Granville Bucci / Blog",
    page: "blog",
    loaded: "blog"
  });
});



module.exports = router;