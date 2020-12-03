const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const reactCtrl = require('../controllers/react');

router.post('/', auth, reactCtrl.createReact);
router.get('/', auth, reactCtrl.getAllReacts);
router.get('/:id', auth, reactCtrl.getAReact);
router.put('/:id', auth, reactCtrl.updateReact);
router.delete('/:id', auth, reactCtrl.deleteReact);
router.delete('/', auth, reactCtrl.findeAndDelete);
module.exports = router;
