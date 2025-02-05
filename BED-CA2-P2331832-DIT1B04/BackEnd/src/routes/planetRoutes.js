const express = require('express');
const router = express.Router();
const controller = require('../controllers/planetController.js');

router.get('/', controller.getAllPlanets);
router.get('/:id', controller.getPlanetById);
router.post('/', controller.addPlanet);
router.put('/:id', controller.updatePlanet);
router.delete('/:id', controller.deletePlanet);

module.exports = router;
