const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('API is running'));

// TODO: Add user & expense routes

module.exports = app;
