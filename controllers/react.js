const jwt = require('jsonwebtoken');
const models = require('../models');

function verifyType(type) {
  if (type === undefined && typeof type !== 'string') {
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

/* Create a reaction */
exports.createReact = async (req, res) => {
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
  try {
    const existingReact = await models.React.findOne({
      where: { userId: id, postId, type },
    });
    if (existingReact !== null) {
      return res.status(409).json({ message: 'Conflict' });
    }
    const react = await models.React.create({ userId: id, postId, type });
    await models.Activity.create({
      userId: id,
      postId,
      type: 'react',
    });
    return res.status(201).json(react);
  } catch (_error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/* Get all users reactions */
exports.getAllReacts = (req, res) => {
  const filter = req.query.postId ? { where: { postId: req.query.postId } } : {};
  models.React.findAll(filter)
    .then((reacts) => {
      return res.status(200).json(reacts);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

/* Get only one reaction */
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

/* Update a reaction */
exports.updateReact = (req, res) => {
  const { id } = req.params;
  models.React.findOne({
    where: { id },
  })
    .then(async (react) => {
      if (!react) {
        return res.status(404).json({ message: 'Not found' });
      }

      const decodedToken = getDecodedToken(req);
      if (!hasRights(decodedToken, react)) {
        return res.status(401).json({ message: 'Unauthorized' });
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

/* Delete a reaction globally */
exports.deleteReact = (req, res) => {
  const { id } = req.params;

  models.React.findOne({
    where: { id },
  })
    .then((react) => {
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
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};

/* Get a specific reaction and delete it */
exports.findOneAndDelete = async (req, res) => {
  const { userId, postId, type } = req.query;
  try {
    const react = await models.React.findOne({
      where: { userId, postId, type },
    });
    if (!react) {
      return res.status(404).json({ message: 'Not found' });
    }
    const decodedToken = getDecodedToken(req);
    if (!hasRights(decodedToken, react)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await models.Activity.destroy({ where: { type: 'react', postId, userId } });
    await models.React.destroy({
      where: { id: react.id },
    });
    return res.status(200).json({ message: 'Reaction has been deleted' });
  } catch (_e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
