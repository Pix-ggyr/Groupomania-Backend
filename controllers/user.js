const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
// const validator = require('./validators/user.js');

function generateAccessToken(data) {
  return jwt.sign(data, process.env.SECRET_TOKEN, { expiresIn: '3600s' });
}

function verifyEmail(email) {
  if (!email) {
    return false;
  }

  if (typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

function verifyAvatar(avatar) {
  // eslint-disable-next-line no-useless-escape
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
  if (bio !== undefined && typeof bio !== 'string') {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (avatar !== undefined && typeof avatar !== 'string') {
    return res.status(400).json({ message: 'Bad request' });
  }
  if (avatar !== undefined && !verifyAvatar(avatar)) {
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

exports.updateUser = (req, res) => {
  /* eslint-disable */
  // récup user qui a pour id req.params.id
  // si erreur dans le .catch => return 500
  // si !user => return 404
  // on check les champs à modifier
  // si erreur (email, password ou avatar) => return 400
  // on update le user qui a pour id req.params.id
  // si erreur dans le .catch => return 500
  // on return 200 + updated user
  const { id } = req.params;
  models.User.findOne({
    where: { id },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Not found' });
      }

      const { firstname, lastname, email, password, bio, avatar } = req.body;

      const modifications = {};

      if (firstname && firstname !== user.firstname && typeof firstname === 'string') {
        modifications.firstname = firstname;
      }
      if (lastname && lastname !== user.lastname && typeof lastname === 'string') {
        modifications.lastname = lastname;
      }
      if (email && email !== user.email && typeof email === 'string') {
        if (!verifyEmail(email)) {
          return res.status(400).json({ message });
        }
      }
      const emailExist = models.User.findOne({
        attribute: ['email'],
        where: { email },
      });

      if (emailExist) {
        return conflict;
      }
      modifications.email = email;

      if (password && bcrypt.compareSync(password, user.password) && typeof password === 'string') {
        if (!verifyPassword(password)) {
          return res.status(400).json({ message: 'Bad request' });
        }
        const newPassword = bcrypt.hashSync(password, 8);
        modifications.password = newPassword;
      }

      if (bio && bio !== user.bio && typeof bio === 'string') {
        modifications.bio = bio;
      }

      if (avatar && avatar !== user.avatar && typeof avatar === 'string') {
        if (!verifyAvatar(avatar)) {
          // return Bad Request
        }

        modifications.avatar = avatar;
      }

      models.User.update(
        {
          ...modifications,
        },
        {
          where: { id },
        }
      )
        .then((updatedUser) => {
          res.status(200).json(updatedUser);
        })
        .catch(() => {
          res.status(500).json({ message: 'Internal server error' });
        });
    })
    .catch(() => {
      return res.status(500).json({ error: '...' });
    });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  models.User.findOne({
    where: { id },
  }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: 'Not found ' });
    }
    models.User.destroy({
      where: { id },
    })
      .then(() => {
        return res.status(200).json({ message: 'User has been deleted' });
      })
      .catch(() => {
        return res.status(400).json({ message: 'Bad reques ' });
      });
    return true;
  });
};

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

exports.getOneUser = (req, res) => {
  const { id } = req.params;
  models.User.findOne({
    where: { id },
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(404).json({ message: 'User not found' });
    });
  return true;
};

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
