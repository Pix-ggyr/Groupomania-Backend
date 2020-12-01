const jwt = require('jsonwebtoken');
const models = require('../models');

function verifyType(type) {
  if (type === undefined && typeof type !== 'string') {
    return false;
  }
  return true;
}

exports.createReact = (req, res) => {
  const { postId, type } = req.body;

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const { id } = decodedToken;

  if (!id) {
    return res.status(400).json({ message: 'Bad request' });
  }

  if (!verifyType(type)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  models.React.create({
    userId: id,
    postId,
    type,
  })
    .then((react) => {
      return res.status(201).json(react);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

exports.getAllReacts = (_req, res) => {
  models.React.findAll()
    .then((reacts) => {
      return res.status(200).json(reacts);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};
exports.getAReact = (req, res) => {
  const { id } = req.params;
  models.React.findOne({
    where: { id },
  })
    .then((react) => {
      if (react === null) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json(react);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};
exports.updateReact = (req, res) => {
  const { id } = req.params;
  models.React.findOne({
    where: { id },
  })
    .then(async (react) => {
      if (!react) {
        return res.status(404).json({ message: 'Not found' });
      }

      const { type } = req.body;
      const modifications = {};

      if (type && type !== react.type && typeof type === 'string') {
        modifications.type = type;
      }

      models.React.update({ ...modifications }, { where: { id } })
        .then(() => {
          models.React.findOne({
            where: { id },
          })
            .then((updatedReact) => {
              return res.status(200).json(updatedReact);
            })
            .catch(() => {
              return res.status(500).json({ message: 'Internal server error' });
            });
        })
        .catch(() => {
          res.status(500).json({ message: 'Internal server error' });
        });
      return true;
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};
exports.deleteReact = (req, res) => {
  const { id } = req.params;
  models.React.findOne({
    where: { id },
  }).then((react) => {
    if (!react) {
      return res.status(404).json({ message: 'Not found' });
    }
    models.React.destroy({
      where: { id },
    })
      .then(() => {
        return res.status(200).json({ message: 'Reaction has been deleted' });
      })
      .catch(() => {
        return res.status(500).json({ message: 'Internal server error' });
      });
    return true;
  });
};
