const upload = require("../middlewares/upload.js")

const Testimony = require('../models/testimony');
const Contact = require('../models/contact');

const testimonyUpload = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('File:', req.file);

  const { point, description, name } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!point || !description || !name || !imagePath) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const testimony = new Testimony({
      point,
      description,
      name,
      image: imagePath,
    });

    await testimony.save();

    res.status(200).json({ message: "Testimony submitted successfully", testimony });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

const contactBucci = async (req, res) => {
  console.log('Request body:', req.body);

  const { firstname, lastname, email, phone, message } = req.body;
  if (!firstname || !lastname || !email || !phone || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const contact = new Contact({
      firstname,
      lastname,
      email,
      phone,
      message,
    });

    await contact.save();

    res.status(200).json({ message: "Message sent successfully", contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

module.exports = {
  testimonyUpload,
  contactBucci,
};