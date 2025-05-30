const express = require("express");
const router = express.Router();
const {
  testimonyUpload,
  contactBucci,
} = require("../controllers/basiccontroller.js");
const upload = require("../middlewares/upload.js");
const Testimony = require("../models/testimony.js");
const adminContact = require("../models/admincontactinfo.js");
const Portfolio = require("../models/portfolio.js");
const Blog = require("../models/blog.js");


// Homepage
router.get("/", async (req, res) => {
  const testimonies = await Testimony.aggregate([{ $sample: { size: 20 } }]);
  const contactinfo = await adminContact.findOne();

  res.render("user/index", {
    title: "Granville Bucci",
    page: "index",
    loaded: "index",
    testimonies,
    contactinfo,
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
    loaded: "portfolio",
  });
});

// Blog page
router.get("/blog", async (req, res) => {
  try {
    const contactinfo = await adminContact.findOne();
    const allBlogs = await Blog.find().sort({ createdAt: -1 });

    let featuredBlog = null;
    let otherBlogs = [];

    for (const blog of allBlogs) {
      if (blog.isFeatured && !featuredBlog) {
        featuredBlog = blog;
      } else {
        otherBlogs.push(blog);
      }
    }

    if (featuredBlog) {
      featuredBlog = {
        ...featuredBlog._doc,
        truncatedContent:
          featuredBlog.blogContent && featuredBlog.blogContent.length > 180
            ? featuredBlog.blogContent.substring(0, 180) + "..."
            : featuredBlog.blogContent,
      };
    }

    otherBlogs = otherBlogs.map((blog) => {
      const truncated =
        blog.blogContent && blog.blogContent.length > 110
          ? blog.blogContent.substring(0, 110) + "..."
          : blog.blogContent;

      return {
        ...blog._doc,
        truncatedContent: truncated,
      };
    });

    res.render("user/blog", {
      contactinfo,
      title: "Granville Bucci / Blog",
      page: "blog",
      loaded: "blog",
      featuredBlog,
      otherBlogs,
    });
  } catch (error) {
    console.error("Error fetching blog posts for blog page:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/blog/:id", async (req, res) => {
  try {
    const contactinfo = await adminContact.findOne();
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).render("404", { title: "Blog Post Not Found" });
    }

    res.render("user/blogsingle", {
      contactinfo,
      title: blog.blogTitle,
      page: "blogsingle",
      loaded: "blogsingle",
      blog: blog,
    });
  } catch (error) {
    console.error("Error fetching single blog post:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
