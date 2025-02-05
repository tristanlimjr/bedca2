const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');

router.get('/items', controller.getAllItems);
router.post('/items', controller.addItem);
router.get('/items/:id', controller.getItemById);
router.put('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);

router.get('/inventory/:user_id', controller.getInventoryByUser);
router.post('/inventory', controller.addInventoryItem);
router.put('/inventory/:id', controller.updateInventoryItem);
router.delete('/inventory/:id', controller.deleteInventoryItem);

module.exports = router;
