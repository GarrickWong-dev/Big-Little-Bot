//"Build and configure the Express application."

const express = require('express');
const path = require('path');
const apiRoutes = require('./route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/pics', express.static(path.join(__dirname, '../pics')));

app.use('/', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Big Little Bot API is running' });
});

module.exports = app;
