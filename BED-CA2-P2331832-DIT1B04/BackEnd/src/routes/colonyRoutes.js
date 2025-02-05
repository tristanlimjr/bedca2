const express = require('express');
const router = express.Router();
const controller = require('../controllers/colonyController.js');

router.get('/', controller.getAllColonies);
router.get('/:id', controller.getColonyById);
router.post('/', controller.addColony);
router.put('/:id', controller.updateColony);
router.delete('/:id', controller.deleteColony);
router.get('/user/:user_id', controller.getColoniesByUserId);

module.exports = router;
