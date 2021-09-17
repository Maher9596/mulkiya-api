const express = require('express');

const ocr = require('./ocr');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/ocr', ocr);

module.exports = router;