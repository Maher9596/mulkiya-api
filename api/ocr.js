const express = require('express');
// const googleVision = require("./packages/google-vision");
const googleVision = require("../packages/google-vision/test");

const router = express.Router();

const path = require("path");

router.get('/', (req, res) => {
    // path.dirname
    const imagePath = path.resolve("./img/1.jpeg");
    console.log(imagePath);
    googleVision.getTextFromFiles(1, [imagePath])
  res.json(['😀', '😳', '🙄']);
});

module.exports = router;