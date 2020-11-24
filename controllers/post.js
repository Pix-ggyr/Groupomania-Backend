const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

exports.createPost = (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const image = req.body.image;
};

// exports.getAllPosts = (req, res) => {};
// exports.getOnePost = (req, res) => {};
// exports.updatePost = (req, res) => {};
// exports.deletePost = (req, res) => {};
