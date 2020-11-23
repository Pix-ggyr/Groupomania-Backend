const fs = require('fs');
const Post = require('../models/post-model');

// create a Post

exports.createPost = (req, res) => {
  const postObject = JSON.parse(req.body.sauce);
};
