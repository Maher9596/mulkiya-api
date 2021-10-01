const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const api = require('./api');

require('dotenv').config();

const app = express();

// === Middleware ===
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.get('/version', (req, res) => res.send(process.env['version']));
app.use('/health-check', (req, res) => res.sendStatus(200));
app.use(/^\/$/, (req, res) => res.sendStatus(200));
app.use('/api/v1', api);

module.exports = app;