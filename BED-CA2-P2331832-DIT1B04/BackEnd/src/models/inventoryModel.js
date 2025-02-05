const pool = require('../services/db');

// ITEM FUNCTIONS
module.exports.getAllItems = (callback) => {
    const SQL_STATEMENT = `SELECT * FROM Items;`;
    pool.query(SQL_STATEMENT, callback);
};

module.exports.getItemById = (item_id, callback) => {
    const SQL_STATEMENT = `SELECT * FROM Items WHERE item_id = ?;`;
    pool.query(SQL_STATEMENT, [item_id], callback);
};

module.exports.addItem = (item_name, item_type, description, rarity, value, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO Items (item_name, item_type, description, rarity, value) 
        VALUES (?, ?, ?, ?, ?);
    `;
    pool.query(SQL_STATEMENT, [item_name, item_type, description, rarity, value], callback);
};

module.exports.updateItem = (item_id, updateData, callback) => {
    const SQL_STATEMENT = `UPDATE Items SET ? WHERE item_id = ?;`;
    pool.query(SQL_STATEMENT, [updateData, item_id], callback);
};

module.exports.deleteItem = (item_id, callback) => {
    const SQL_STATEMENT = `DELETE FROM Items WHERE item_id = ?;`;
    pool.query(SQL_STATEMENT, [item_id], callback);
};

// INVENTORY FUNCTIONS
module.exports.getInventoryByUser = (user_id, callback) => {
    const SQL_STATEMENT = `
        SELECT Inventory.inventory_id, Inventory.user_id, Items.item_name, Items.item_type, 
               Items.description, Items.rarity, Items.value, Inventory.quantity 
        FROM Inventory
        JOIN Items ON Inventory.item_id = Items.item_id
        WHERE Inventory.user_id = ?;
    `;
    
    pool.query(SQL_STATEMENT, [user_id], (error, results) => {
        if (error) {
            console.error("SQL Error:", error);
            return callback(error, null);
        }
        
        console.log("Retrieved Inventory:", results);
        callback(null, results);
    });
};

module.exports.addInventoryItem = (user_id, item_id, quantity, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO Inventory (user_id, item_id, quantity) 
        VALUES (?, ?, ?);
    `;
    pool.query(SQL_STATEMENT, [user_id, item_id, quantity], callback);
};

module.exports.updateInventoryItem = (inventory_id, updateData, callback) => {
    const SQL_STATEMENT = `UPDATE Inventory SET ? WHERE inventory_id = ?;`;
    pool.query(SQL_STATEMENT, [updateData, inventory_id], callback);
};

module.exports.deleteInventoryItem = (inventory_id, callback) => {
    const SQL_STATEMENT = `DELETE FROM Inventory WHERE inventory_id = ?;`;
    pool.query(SQL_STATEMENT, [inventory_id], callback);
};
