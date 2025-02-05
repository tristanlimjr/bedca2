const model = require('../models/inventoryModel');

// Get All Items
module.exports.getAllItems = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in getAllItems:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };
    model.getAllItems(callback);
};

// Get Item by ID
module.exports.getItemById = (req, res, next) => {
    const itemId = req.params.id;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in getItemById:", error);
            res.status(500).json(error);
        } else if (results.length === 0) {
            res.status(404).json({ message: "Item not found" });
        } else {
            res.status(200).json(results[0]);
        }
    };
    model.getItemById(itemId, callback);
};

// Add New Item
module.exports.addItem = (req, res, next) => {
    const { item_name, item_type, description, rarity, value } = req.body;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in addItem:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({ message: "Item added successfully", item_id: results.insertId });
        }
    };
    model.addItem(item_name, item_type, description, rarity, value, callback);
};

// Update Item
module.exports.updateItem = (req, res, next) => {
    const itemId = req.params.id;
    const updateData = req.body;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in updateItem:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "Item updated successfully" });
        }
    };
    model.updateItem(itemId, updateData, callback);
};

// Delete Item
module.exports.deleteItem = (req, res, next) => {
    const itemId = req.params.id;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in deleteItem:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "Item deleted successfully" });
        }
    };
    model.deleteItem(itemId, callback);
};

// Get Inventory by User ID
module.exports.getInventoryByUser = (req, res, next) => {
    const userId = req.params.user_id;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in getInventoryByUser:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json(results);
        }
    };
    model.getInventoryByUser(userId, callback);
};

// Add Inventory Item
module.exports.addInventoryItem = (req, res, next) => {
    const { user_id, item_id, quantity } = req.body;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in addInventoryItem:", error);
            res.status(500).json(error);
        } else {
            res.status(201).json({ message: "Inventory item added successfully", inventory_id: results.insertId });
        }
    };
    model.addInventoryItem(user_id, item_id, quantity, callback);
};

// Update Inventory Item
module.exports.updateInventoryItem = (req, res, next) => {
    const inventoryId = req.params.id;
    const updateData = req.body;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in updateInventoryItem:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "Inventory item updated successfully" });
        }
    };
    model.updateInventoryItem(inventoryId, updateData, callback);
};

// Delete Inventory Item
module.exports.deleteInventoryItem = (req, res, next) => {
    const inventoryId = req.params.id;
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in deleteInventoryItem:", error);
            res.status(500).json(error);
        } else {
            res.status(200).json({ message: "Inventory item deleted successfully" });
        }
    };
    model.deleteInventoryItem(inventoryId, callback);
};
