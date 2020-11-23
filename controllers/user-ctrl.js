const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

exports.register = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'User created succesfully !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Cannot find this user' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        // eslint-disable-next-line consistent-return
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'This password is incorrect' });
          }
          res.status(200).json({
            // eslint-disable-next-line no-underscore-dangle
            userId: user._id,
            token: jwt.sign(
              // eslint-disable-next-line no-underscore-dangle
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
