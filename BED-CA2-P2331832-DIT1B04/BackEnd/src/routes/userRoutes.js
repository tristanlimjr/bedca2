const express = require('express');
const router = express.Router();

const controller = require("../controllers/userController")

router.get('/', controller.readAllUsers);
router.get('/:username', controller.getUserByUsername)
router.post('/', controller.createNewUser);
router.put('/:id', controller.updateUserById);
router.put('/:userId/skillpoints', controller.updateSkillpoints)
router.get('/count/users', controller.getTotalUsers);

module.exports = router;