const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');

router.get('/', auth, userCtrl.getAllUsers);
router.post('/', auth, multer, userCtrl.createUser);
router.get('/:id', auth, userCtrl.getOneUser);
router.put('/:id', auth, multer, userCtrl.updateUser);
router.delete('/:id', auth, userCtrl.deleteUser);
router.get('/me', auth, userCtrl.getMyUser);
router.post('/register', multer, userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/logout', auth, userCtrl.logout);
module.exports = router;
