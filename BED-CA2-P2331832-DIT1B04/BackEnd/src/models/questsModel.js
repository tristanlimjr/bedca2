const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM Quests;
    `;
    
    pool.query(SQLSTATMENT, callback);
}

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
        INSERT INTO Quests (challenge_id, quest_name, quest_description, difficulty, reward_points)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [data.challenge_id, data.quest_name, data.quest_description, data.difficulty, data.reward_points];
    
    pool.query(SQLSTATMENT, VALUES, callback);
}