const jwt = require('jsonwebtoken');
const models = require('../models');

exports.getAllActivities = (_req, res) => {
  models.Activity.findAll()
    .then((activities) => {
      return res.status(200).json(activities);
    })
    .catch(() => {
      return res.status(401).json({ message: 'Unauthorized' });
    });
  return true;
};

exports.getLatestsActivities = (req, res) => {};

exports.getAnActivity = (req, res) => {
  const { id } = req.params;
  models.Activity.findOne({
    where: { id },
  })
    .then((activity) => {
      res.status(200).json(activity);
    })
    .catch(() => {
      res.status(404).json({ message: 'Activity not found' });
    });
  return true;
};
