const pool = require('../services/db');

module.exports.selectAll = (callback) => {
    const SQL_STATEMENT = `SELECT * FROM Colonies;`;
    pool.query(SQL_STATEMENT, callback);
};

module.exports.selectById = (colonyId, callback) => {
    const SQL_STATEMENT = `SELECT * FROM Colonies WHERE colony_id = ?;`;
    pool.query(SQL_STATEMENT, [colonyId], callback);
};

module.exports.insert = (data, callback) => {
    const { user_id, colony_name, planet_id, population, resources_generated, defense_level } = data;
    const SQL_STATEMENT = `
        INSERT INTO Colonies (user_id, colony_name, planet_id, population, resources_generated, defense_level, creation_date) 
        VALUES (?, ?, ?, ?, ?, ?, NOW());
    `;
    pool.query(SQL_STATEMENT, [user_id, colony_name, planet_id, population, resources_generated, defense_level], callback);
};

module.exports.update = (colonyId, data, callback) => {
    const { colony_name, population, resources_generated, defense_level } = data;
    const SQL_STATEMENT = `
        UPDATE Colonies 
        SET colony_name = ?, population = ?, resources_generated = ?, defense_level = ? 
        WHERE colony_id = ?;
    `;
    pool.query(SQL_STATEMENT, [colony_name, population, resources_generated, defense_level, colonyId], callback);
};

module.exports.delete = (colonyId, callback) => {
    const SQL_STATEMENT = `DELETE FROM Colonies WHERE colony_id = ?;`;
    pool.query(SQL_STATEMENT, [colonyId], callback);
};

module.exports.selectByUserId = (userId, callback) => {
    const SQL_STATEMENT = `
        SELECT c.colony_name, c.population, c.resources_generated, c.defense_level, 
               p.planet_name
        FROM Colonies c
        JOIN Planets p ON c.planet_id = p.planet_id
        WHERE c.user_id = ?;
    `;
    pool.query(SQL_STATEMENT, [userId], callback);
};
