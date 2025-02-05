const pool = require('../services/db.js');

module.exports.selectAll = (callback) => {
    const SQL_STATEMENT = `SELECT * FROM Planets;`;
    pool.query(SQL_STATEMENT, callback);
};

module.exports.selectById = (planetId, callback) => {
    const SQL_STATEMENT = `SELECT * FROM Planets WHERE planet_id = ?;`;
    pool.query(SQL_STATEMENT, [planetId], callback);
};

module.exports.insert = (data, callback) => {
    const { planet_name, planet_type, resource_richness, habitable } = data;
    const SQL_STATEMENT = `
        INSERT INTO Planets (planet_name, planet_type, resource_richness, habitable) 
        VALUES (?, ?, ?, ?);
    `;
    pool.query(SQL_STATEMENT, [planet_name, planet_type, resource_richness, habitable], callback);
};

module.exports.update = (planetId, data, callback) => {
    const { planet_name, planet_type, resource_richness, habitable } = data;
    const SQL_STATEMENT = `
        UPDATE Planets 
        SET planet_name = ?, planet_type = ?, resource_richness = ?, habitable = ? 
        WHERE planet_id = ?;
    `;
    pool.query(SQL_STATEMENT, [planet_name, planet_type, resource_richness, habitable, planetId], callback);
};

module.exports.delete = (planetId, callback) => {
    const SQL_STATEMENT = `DELETE FROM Planets WHERE planet_id = ?;`;
    pool.query(SQL_STATEMENT, [planetId], callback);
};
