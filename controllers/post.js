const jwt = require('jsonwebtoken');
const models = require('../models');

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
    .then((post) => {
      return res.status(201).json(post);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

exports.getAllPosts = (_req, res) => {
  models.Post.findAll()
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

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

exports.updatePost = (req, res) => {
  const { id } = req.params;
  models.Post.findOne({
    where: { id },
  })
    .then(async (post) => {
      if (!post) {
        return res.status(404).json({ message: 'Not found' });
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

exports.deletePost = (req, res) => {
  const { id } = req.params;
  models.Post.findOne({
    where: { id },
  }).then((post) => {
    if (!post) {
      return res.status(404).json({ message: 'Not found' });
    }
    models.Post.destroy({
      where: { id },
    })
      .then(() => {
        return res.status(200).json({ message: 'Post has been deleted' });
      })
      .catch(() => {
        return res.status(500).json({ message: 'Internal server error' });
      });
    return true;
  });
};
