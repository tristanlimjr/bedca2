const pool = require('../services/db');

// Select All
module.exports.selectAll = (callback) => {
    const SQL_STATEMENT = `
        SELECT * FROM User;
    `;
    pool.query(SQL_STATEMENT, callback);
};

// Select user by ID
module.exports.selectById = (id, callback) => {
    const SQL_STATEMENT = `SELECT * FROM User WHERE user_id = ?;`;
    pool.query(SQL_STATEMENT, [id], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        return callback(null, results.length ? results[0] : null);
    });
};

// Insert a new user
module.exports.insertSingle = (data, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO User (username, email, password ,skillpoints, level)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [data.username, data.email, data.password, data.skillpoints, data.level];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// Find user by username
module.exports.findByUsername = (username, callback) => {
    const SQL_STATEMENT = `SELECT * FROM User WHERE username = ? LIMIT 1;`;

    pool.query(SQL_STATEMENT, [username], (error, results) => {
        if (error) {
            console.error("Database Error (findByUsername):", error);
            return callback(error, null);
        }

        return callback(null, results.length ? results[0] : null);
    });
};

// Update username and skillpoints by user ID
module.exports.updateById = (data, callback) => {
    const SQL_STATEMENT = `
        UPDATE User
        SET username = ?, skillpoints = ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.skillpoints, data.user_id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// Update skillpoints
module.exports.updateSkillpoints = (userId, skillpoints, callback) => {
    const SQL_STATEMENT = `
        UPDATE User 
        SET skillpoints = COALESCE(skillpoints, 0) + ? 
        WHERE user_id = ?;
    `;

    console.log(`Executing SQL: UPDATE User SET skillpoints = skillpoints + ${skillpoints} WHERE user_id = ${userId}`);

    pool.query(SQL_STATEMENT, [skillpoints, userId], (error, result) => {
        if (error) {
            console.error("Database error (updateSkillpoints):", error);
            return callback(error, null);
        }

        console.log("Skillpoints update result:", result);
        return callback(null, result);
    });
};


module.exports.getUserSkillpoints = (userId, callback) => {
    const SQL_STATEMENT = `
        SELECT skillpoints FROM User WHERE user_id = ?;
    `;

    pool.query(SQL_STATEMENT, [userId], (error, results) => {
        if (error) {
            console.error("Database error (getUserSkillpoints):", error);
            return callback(error, null);
        }

        console.log("Retrieved skillpoints:", results);
        return callback(null, results.length ? results[0] : { skillpoints: 0 });
    });
};

module.exports.getTotalUsers = (callback) => {
    const SQL_STATEMENT = `SELECT COUNT(*) AS total FROM User;`;
    
    pool.query(SQL_STATEMENT, (error, results) => {
        if (error) {
            console.error("SQL Query Error:", error);
            return callback(error, null);
        }
        
        if (!results || results.length === 0) {
            console.warn("No users found in the database.");
            return callback(null, [{ total: 0 }]);
        }
        
        callback(null, results);
    });
};
