const jwt = require('jsonwebtoken');
const models = require('../models');

/* Some nice and useful verification functions */
function verifyTitle(title) {
  if (title === undefined && typeof title !== 'string') {
    return false;
  }
  return true;
}
function verifyContent(content) {
  if (content === undefined) {
    return false;
  }
  if (typeof content !== 'string') {
    return false;
  }
  return true;
}
function verifyImage(image) {
  if (image === undefined) {
    return false;
  }
  if (typeof image !== 'string') {
    return false;
  }
  return true;
}
function hasRights(token, ressource) {
  if (token.id === ressource.userId) {
    return true;
  }
  if (token.isAdmin) {
    return true;
  }
  return false;
}
function getDecodedToken(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  return decodedToken;
}

/* Create a post */
exports.createPost = (req, res) => {
  const { title, content, image } = req.body;

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const { id } = decodedToken;

  if (!id) {
    return res.status(400).json({ message: 'Bad request' });
  }

  if (!verifyTitle(title)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (content !== undefined && !verifyContent(content)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (image !== undefined && !verifyImage(image)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  models.Post.create({
    userId: id,
    title,
    content,
    image,
  })
    .then(async (post) => {
      await models.Activity.create({
        userId: id,
        postId: post.id,
        type: 'post',
      });
      return res.status(201).json(post);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

/* Get all the posts */
exports.getAllPosts = (_req, res) => {
  models.Post.findAll({
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

/* Get one post - to be used in the future */
exports.getOnePost = (req, res) => {
  const { id } = req.params;
  models.Post.findOne({
    where: { id },
  })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json(post);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

/* Update your post - if admin, update whatever post */
exports.updatePost = (req, res) => {
  const { id } = req.params;
  models.Post.findOne({
    where: { id },
  })
    .then(async (post) => {
      if (!post) {
        return res.status(404).json({ message: 'Not found' });
      }

      const decodedToken = getDecodedToken(req);
      if (!hasRights(decodedToken, post)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { title, content, image } = req.body;
      const modifications = {};

      if (title && title !== post.title && typeof title === 'string') {
        modifications.title = title;
      }
      if (content && content !== post.content && typeof content === 'string') {
        modifications.content = content;
      }
      if (image && image !== post.image && typeof image === 'string') {
        modifications.image = image;
      }

      models.Post.update({ ...modifications }, { where: { id } })
        .then(() => {
          models.Post.findOne({
            where: { id },
          })
            .then((updatedPost) => {
              res.status(200).json(updatedPost);
            })
            .catch(() => {
              res.status(500).json({ message: 'Internal server error' });
            });
        })
        .catch(() => {
          res.status(500).json({ message: 'Internal server error' });
        });
      return true;
    })
    .catch(() => {
      res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

/* Delete your post - if admin, delete whatever post */
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await models.Post.findOne({
      where: { id },
    });
    if (!post) {
      return res.status(404).json({ message: 'Not found' });
    }
    const decodedToken = getDecodedToken(req);
    if (!hasRights(decodedToken, post)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await models.Activity.destroy({ where: { postId: id } });
    await models.React.destroy({ where: { postId: id } });
    await models.Post.destroy({ where: { id } });
    return res.status(200).json({ message: 'Post has been deleted' });
  } catch (_e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
