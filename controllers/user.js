const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

function generateAccessToken(data) {
  return jwt.sign(data, process.env.SECRET_TOKEN, { expiresIn: '3600s' });
}

function verifyEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

function verifyAvatar(avatar) {
  const avatarRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  return avatarRegex.test(avatar);
}

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
  if (!verifyEmail(email)) {
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
  if (avatar !== null && avatar !== undefined && !verifyAvatar(avatar)) {
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
          models.User.create({ firstname, lastname, email, password: hash, bio, avatar })
            .then((user) => {
              const accessToken = generateAccessToken({ email: user.email, id: user.id });
              return res.status(201).json({ user, accessToken });
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

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (!verifyEmail(email)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  models.User.findOne({
    where: { email },
  }).then((existingUser) => {
    if (existingUser === null) {
      return res.status(404).json({ message: 'Not found' });
    }
    bcrypt
      .compare(password, existingUser.password)
      .then((passwordsMatch) => {
        if (!passwordsMatch) {
          return res.status(400).json({ message: 'Bad request' });
        }
        const accessToken = generateAccessToken({ email: existingUser.email, id: existingUser.id });
        return res.status(200).json({ user: existingUser, accessToken });
      })
      .catch(() => {
        return res.status(400).json({ message: 'Bad request' });
      });
    return true;
  });
  return true;
};

exports.logout = (req, res) => {
  const getToken = req.headers.authorization.split(' ')[1];
  // rtfm revoke token jwt
};

exports.createUser = (req, res) => {
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

  if (!verifyEmail(email)) {
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
  if (avatar !== null && avatar !== undefined && !verifyAvatar(avatar)) {
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

exports.updateUser = (req, res) => {};

exports.deleteUser = (req, res) => {};

exports.getAllUsers = (req, res) => {
  models.User.findAll()
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch(() => {
      return res.status(401).json({ message: 'Unauthorized' });
    });
  return true;
};

exports.getOneUser = (req, res) => {};

exports.getMyUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const { id } = decodedToken;
  models.User.findOne({
    where: { id },
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(401).json({ message: 'Unauthorized' });
    });
  return true;
};
