const express = require('express');
const router = express.Router();

const controller = require("../controllers/partyController")

router.get('/', controller.readAll)
router.post('/', controller.createParty)
router.get('/:id', controller.viewMembers) 
router.post('/:id', controller.addMember)
router.delete('/:id', controller.kickMember)
router.delete('/:id', controller.deleteParty)
router.get('/user/:userId', controller.findPartyByUserId)

module.exports = router;