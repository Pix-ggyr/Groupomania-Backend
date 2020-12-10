const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.get('/me', auth, userCtrl.getMyUser);
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
// router.post('/logout', auth, userCtrl.logout);
router.get('/:id', auth, userCtrl.getOneUser);
router.put('/:id', auth, userCtrl.updateUser);
router.delete('/:id', auth, userCtrl.deleteUser);

router.get('/', auth, userCtrl.getAllUsers);
router.post('/', auth, userCtrl.createUser);
module.exports = router;
