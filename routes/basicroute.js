const express = require("express");
const router = express.Router();
const { testimonyUpload,  contactBucci } = require('../controllers/basicController.js');
const upload = require("../middlewares/upload.js");
const Testimony = require('../models/testimony.js');

// Homepage
router.get("/", async (req, res) => {

  const testimonies = await Testimony.find().sort({ createdAt: -1 }).limit(5);

  res.render("user/index", {
    title: "Granville Bucci",
    page: "index",
    loaded: "index",
    testimonies: testimonies
  });
});

router.post("/testimony", upload.single("image"), testimonyUpload);
router.post("/contact", contactBucci);


// Portfolio page
router.get("/portfolio", (req, res) => {
  res.render("user/portfolio", {
    title: "Granville Bucci / Portfolio",
    page: "portfolio",
    loaded: "portfolio"
  });
});

// Blog page
router.get("/blog", (req, res) => {
  res.render("user/blog", {
    title: "Granville Bucci / Blog",
    page: "blog",
    loaded: "blog"
  });
});
router.get("/blogsingle", (req, res) => {
  res.render("user/blogsingle", {
    title: "Granville Bucci / Blog",
    page: "blog",
    loaded: "blog"
  });
});



module.exports = router;