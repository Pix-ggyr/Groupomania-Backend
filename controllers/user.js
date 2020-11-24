const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

exports.register = (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const password = req.body.password;
  models.User.findOne({
    attributes: ['email'],
    where: { email },
  });
};

exports.login = (req, res) => {};

exports.deleteUser = (req, res) => {};
