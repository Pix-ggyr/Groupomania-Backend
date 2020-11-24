const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

exports.register = (req, res) => {
  const { email, firstname, lastname, password, bio, avatar } = req.body;

  if (email === undefined || firstname === undefined || lastname === undefined || password === undefined) {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (
    typeof email !== 'string' ||
    typeof firstname !== 'string' ||
    typeof lastname !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({ message: 'Bad request' });
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Bad request' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (bio !== null && bio !== undefined && typeof bio !== 'string') {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (avatar !== null && avatar !== undefined && typeof avatar !== 'string') {
    return res.status(400).json({ message: 'Bad request' });
  }
  const avatarRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  if (avatar !== null && avatar !== undefined && !avatarRegex.test(avatar)) {
    return res.status(422).json({ message: 'Unprocessable entity' });
  }
  models.User.findOne({
    attributes: ['email'],
    where: { email },
  }).then((existingUser) => {
    if (existingUser) {
      res.status(409).json({
        error: 'Conflict',
      });
    } else {
      bcrypt
        .hash(password, 8)
        .then((hash) => {
          // eslint-disable-next-line no-console
          models.User.create({ firstname, lastname, email, password: hash, bio, avatar })
            .then((user) => {
              return res.status(201).json(user);
            })
            .catch(() => {
              return res.status(400).json({ message: 'Bad request' });
            });
        })
        .catch(() => {
          return res.status(400).json({ message: 'Bad request' });
        });
    }
  });
  return true;
};

exports.login = (req, res) => {};
exports.logout = (req, res) => {};
exports.createUser = (req, res) => {};
exports.updateUser = (req, res) => {};
exports.deleteUser = (req, res) => {};
exports.getAllUsers = (req, res) => {};
exports.getOneUser = (req, res) => {};
exports.getMyUser = (req, res) => {};
