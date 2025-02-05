const model = require('../models/questsModel')

module.exports.createQuest = (req, res, next) =>
{
    if(req.body.quest_name == undefined || req.body.challenge_id == undefined)
    {
        res.status(400).send("Error: quest_name or challenge_id is undefined");
        return;
    }
        
    const data = {
        challenge_id: req.body.challenge_id,
        quest_name: req.body.quest_name,
        quest_description: req.body.quest_description,
        difficulty: req.body.difficulty,
        reward_points: req.body.reward_points
    }
        
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error create quest:", error);
            res.status(500).json(error);
        } else {
            console.error("User created successfully:", error)
            res.status(201).json({
                quest_id: results.insertId,
                challenge_id: data.challenge_id,
                quest_name: data.quest_name,
                quest_description: data.quest_description,
                difficulty: data.difficulty,
                reward_points: data.reward_points
            });
        }
    }
        
    model.insertSingle(data, callback);
}

module.exports.readAll = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAll:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }
    model.selectAll(callback);
}