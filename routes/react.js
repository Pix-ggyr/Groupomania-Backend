const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const reactCtrl = require('../controllers/react-ctrl');

router.get('/', auth, reactCtrl.getAllReacts);
router.get('/:id', auth, reactCtrl.getAReact);
router.put('/:id', auth, multer, reactCtrl.updateReact);
router.delete('/:id', auth, reactCtrl.deleteReact);
module.exports = router;
