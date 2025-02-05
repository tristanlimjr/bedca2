const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM Party;
        `;

    pool.query(SQLSTATMENT, callback);
}

module.exports.findParty = (party_name, callback) => 
{
    const SQLSTATMENT = `
        SELECT * FROM Party WHERE party_name = ?
    `;
    pool.query(SQLSTATMENT, [party_name], callback);
};

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
        INSERT INTO Party (party_name, creation_date, leader_id)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.party_name, data.creation_date, data.leader_id];
    
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.checkMemberExists = (party_id, user_id, callback) => {
    const SQLSTATMENT = 'SELECT * FROM Party_Members WHERE party_id = ? AND user_id = ?';
    pool.query(SQLSTATMENT, [party_id, user_id], (erroror, results) => {
        if (erroror) {
            return callback(erroror, null);
        }
        return callback(null, results.length > 0);
    });
};

module.exports.addMemberToParty = (party_id, user_id, callback) => {
    const SQLSTATMENT = 'INSERT INTO Party_Members (party_id, user_id) VALUES (?, ?)';
    pool.query(SQLSTATMENT, [party_id, user_id], (erroror, result) => {
        if (erroror) {
            return callback(erroror, null);
        }
        return callback(null, result);
    });
};

module.exports.getAllMembers = (party_id, callback) => {
    const SQLSTATMENT = `
        SELECT p.party_id, p.party_name, p.leader_id, u.username AS leader_name, m.user_id, m.username
        FROM Party p
        JOIN Party_Members pm ON p.party_id = pm.party_id
        JOIN User u ON p.leader_id = u.user_id  -- Fetch leader username
        JOIN User m ON pm.user_id = m.user_id   -- Fetch members' usernames
        WHERE p.party_id = ?`;
    
    pool.query(SQLSTATMENT, [party_id], (erroror, results) => {
        if (erroror) {
            return callback(erroror, null);
        }
        return callback(null, results);
    });
};

module.exports.kickMemberFromParty = (party_id, user_id, callback) => {
    const SQLSTATMENT = 'DELETE FROM Party_Members WHERE party_id = ? AND user_id = ?';
    
    pool.query(SQLSTATMENT, [party_id, user_id], (error, result) => {
        if (error) {
            return callback(error, null);
        }
        return callback(null, result);
    });
};

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
        DELETE FROM Party
        WHERE party_id = ?;
    `;
    
    const VALUES = [data.id];   

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.findPartyByUserId = (data, callback) => {
    const SQLSTATMENT = `
        SELECT p.*
        FROM Party_Members pm
        JOIN Party p ON pm.party_id = p.party_id
        WHERE pm.user_id = ?`;

    pool.query(SQLSTATMENT, [data.user_id], callback);
};
