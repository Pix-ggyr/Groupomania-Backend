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

exports.getLatestsActivities = (_req, res) => {
  models.Activity.findAll({
    limit: 15,
    order: [['createdAt', 'DESC']],
  })
    .then((activities) => {
      return res.status(200).json(activities);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.getAnActivity = (req, res) => {
  const { id } = req.params;
  models.Activity.findOne({
    where: { id },
  })
    .then((activity) => {
      if (activity === null) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json(activity);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Internal server error' });
    });
  return true;
};
