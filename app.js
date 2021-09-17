const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require('dotenv').config();

const app = express();

// === Middleware ===
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.get('/version', (req, res) => res.send(process.env['version']));
app.use('/health-check', (req, res) => res.sendStatus(200));
app.use(/^\/$/, (req, res) => res.sendStatus(200));

app.get('/v1', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });


module.exports = app;