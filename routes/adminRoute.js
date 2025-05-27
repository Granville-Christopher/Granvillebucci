const express = require("express");
const router = express.Router();

// Example route
router.get("/admin", (req, res) => {
  res.send("Admin Panel");
});

module.exports = router; 
