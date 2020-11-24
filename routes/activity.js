const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const activityCtrl = require('../controllers/activity');

router.get('/', auth, activityCtrl.getAllActivities);
router.get('/latest', auth, activityCtrl.getLatestsActivites);
router.get('/:id', auth, activityCtrl.getAnActivity);
module.exports = router;
