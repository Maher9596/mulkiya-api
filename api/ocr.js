const express = require('express');
const multer  = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const googleVision = require("../packages/google-vision");

const router = express.Router();

const path = require("path");

router.get('/', (req, res) => {
  res.status(200).json("Health ok")
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const uploadedImageInBase64 = req.file.buffer.toString("base64");
    const GoogleVision = new googleVision;
    const dates = await GoogleVision.getTextFromImage(uploadedImageInBase64);
    await res.status(200).json({
      message: "Successfully uploaded image",
      dates
    });
  } catch (error) {
    console.log("Failed to upload image");
    console.log("Error message", error);
  }
})

module.exports = router;
