const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM FitnessChallenge;
        `;

    pool.query(SQLSTATMENT, callback);
}

module.exports.selectById = (challenge_id, callback) => {
    const query = `
        SELECT creator_id, skillpoints 
        FROM FitnessChallenge 
        WHERE challenge_id = ?
    `;
    pool.query(query, [challenge_id], (error, results) => {
        if (error) {
            return callback(error, null);
        }

        if (results.length > 0) {
            callback(null, results[0]);
        } else {
            callback(null, null);
        }
    });
};

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
        INSERT INTO FitnessChallenge (challenge, creator_id, skillpoints)
        VALUES (?, ?, ?);
        `;
    const VALUES = [data.challenge, data.creator_id, data.skillpoints];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
        UPDATE FitnessChallenge
        SET challenge = ?, skillpoints = ?
        WHERE challenge_id = ? AND creator_id = ?
    `;
    
    const VALUES = [data.challenge, data.skillpoints, data.challenge_id, data.creator_id];
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
        DELETE FROM FitnessChallenge 
        WHERE challenge_id = ?;
        `;
    const VALUES = [data.id];

    
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.createCompletionRecord = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, completed, creation_date, notes)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [data.challenge_id, data.user_id, data.completed, data.creation_date, data.notes];

    pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.readAllById = (challengeId, callback) => {
    const SQLSTATMENT = `
        SELECT user_id, completed, creation_date, notes
        FROM UserCompletion
        WHERE challenge_id = ?
    `;
    const VALUES = [challengeId];

    pool.query(SQLSTATMENT, VALUES, (error, results) => {
        if (error) {
            console.error("Error fetching participants:", error);
            return callback(error, null);
        }

        if (!results || results.length === 0) {
            return callback(new Error("No participants found for this challenge"), null);
        }

        callback(null, results);
    });
};

module.exports.checkById = (userId, callback) => {
    const SQL = `
        SELECT UC.challenge_id, FC.challenge, FC.skillpoints, UC.completed, UC.creation_date, UC.notes
        FROM UserCompletion UC
        JOIN FitnessChallenge FC ON UC.challenge_id = FC.challenge_id
        WHERE UC.user_id = ? AND UC.completed = true
        ORDER BY UC.creation_date DESC;
    `;

    pool.query(SQL, [userId], (error, results) => {
        if (error) {
            console.error("Database error (checkById):", error);
            return callback(error, null);
        }

        return callback(null, results);
    });
};
