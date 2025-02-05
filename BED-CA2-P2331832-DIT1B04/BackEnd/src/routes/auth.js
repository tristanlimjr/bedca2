const express = require('express');
const controller = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/protected', authMiddleware, controller.getUserData);

module.exports = router;
