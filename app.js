const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const basicRoute = require("./routes/basicroute");
const adminRoute = require("./routes/adminRoute");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to database
const dbURI = process.env.DBURI;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });

// Register view engine
app.set("view engine", "ejs");

// Middleware for static files
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Setting for express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Routes
app.use("/", basicRoute);
app.use("/admin", adminRoute);

// 404 route - Corrected: Added 'next' parameter to the function signature
app.use((req, res, next) => {
  res.status(404).render("404", { title: "404" });
});
