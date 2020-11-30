const models = require('../models');

function verifyTitle(title) {
  if (title === undefined && typeof title !== 'string') {
    return false;
  }
  return true;
}

function verifyContent(content) {
  if (typeof content !== 'string') {
    return false;
  }
  return true;
}

function verifyImage(image) {
  if (typeof image !== 'string') {
    return false;
  }
  return true;
}

exports.createPost = (req, res) => {
  const { userId, title, content, image } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'Bad request' });
  }

  if (!verifyTitle(title)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (!verifyContent(content)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (!verifyImage(image)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  models.Post.create({ userId, title, content, image })
    .then((post) => {
      return res.status(201).json(post);
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
  return true;
};

exports.getAllPosts = (req, res) => {};
exports.getOnePost = (req, res) => {};
exports.updatePost = (req, res) => {};
exports.deletePost = (req, res) => {};
