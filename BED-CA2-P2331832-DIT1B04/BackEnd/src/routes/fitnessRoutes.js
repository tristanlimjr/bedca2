const express = require('express');
const router = express.Router();

const controller = require("../controllers/fitnessController")
const usercontroller = require("../controllers/userController")

router.post('/', controller.createNewChallenge)
router.get('/', controller.readAllChallenge)
router.put('/:id', controller.updateById)
router.delete('/:id', controller.deleteById)
router.post('/:id', controller.createCompletionRecord, usercontroller.updateSkillpointsChallenge)
router.get('/:id', controller.readAllById)
router.get('/:userId/completed-challenges', controller.checkById)

module.exports = router;