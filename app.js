const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const saucesRoutes = require('./routes/sauces-path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const reactRoutes = require('./routes/react');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// app.use('/api/sauces', saucesRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/react', reactRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
