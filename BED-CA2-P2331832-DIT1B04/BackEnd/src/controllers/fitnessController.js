const model = require('../models/fitnessModel')

module.exports.readAllChallenge = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllChallenge:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }
    model.selectAll(callback);
}

module.exports.createNewChallenge = (req, res, next) =>
{
    if(req.body.challenge == undefined || req.body.user_id == undefined || req.body.skillpoints == undefined)
    {
        res.status(400).send("Error: challenge, user_id or skillpoints is undefined");
        return;
    }
    
    const data = {
        challenge: req.body.challenge,
        creator_id: req.body.user_id,
        skillpoints: req.body.skillpoints
    }
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error creating new user:", error);
            res.status(500).json({ error: "Internal Server Error", details: error });
        } else {
            console.log("User created successfully:", results);
            res.status(201).json({
                challenge_id: results.insertId,
                challenge: data.challenge,
                creator_id: data.creator_id,
                skillpoints: data.skillpoints
            });
        }
    };
            
    model.insertSingle(data, callback);
};

module.exports.updateById = (req, res, next) => {
    if (req.body.user_id === undefined || req.body.skillpoints === undefined || req.body.challenge === undefined) {
        res.status(400).json({
            message: "Error: User, skillpoints, or challenge is undefined"
        });
        return;
    }

    const challengeId = req.params.id;

    const data = {
        challenge_id: req.params.id,
        challenge: req.body.challenge,
        creator_id: req.body.user_id,
        skillpoints: req.body.skillpoints
    };

    model.selectById(challengeId, (error, results) => {
        if (error) {
            res.status(500).json({ error: "Internal Server Error", details: error });
            return;
        }

        if (!results) {
            res.status(404).json({ message: "Challenge not found." });
            return;
        }

        if (results.creator_id !== data.creator_id) {
            res.status(403).json({
                message: "Forbidden due to not correct creator."
            });
            return;
        }

        model.updateById(data, (error, results) => {
            if (error) {
                res.status(500).json({ error: "Internal Server Error", details: error });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ message: "Challenge not updated. No matching records found." });
                return;
            }

            res.status(200).json({
                challenge_id: data.challenge_id,
                challenge: data.challenge,
                creator_id: data.creator_id,
                skillpoints: data.skillpoints
            });
        });
    });
};

module.exports.deleteById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteById:", error);
            res.status(500).json({ error: "Internal Server Error", details: error });
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Challenge not found"
                });
            } else {
                res.status(204).send();         
            }
        }
    }
    
    model.deleteById(data, callback);
}

module.exports.createCompletionRecord = (req, res, next) => {
    if (!req.body.creation_date) {
        return res.status(400).json({ message: "Error: Creation_date is missing" });
    }

    const challengeId = req.params.id;

    model.selectById(challengeId, (error, challengeResults) => {
        if (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error });
        }

        if (!challengeResults) {
            return res.status(404).json({ message: "Challenge not found." });
        }

        let isCompleted = req.body.completed === true || req.body.completed === "true";
        skillpointsAdded = isCompleted ? (challengeResults.skillpoints ?? 0) : 5;
        next();
        
        const data = {
            challenge_id: challengeId,
            user_id: req.body.user_id,
            completed: req.body.completed,
            creation_date: req.body.creation_date,
            notes: req.body.notes
        };

         // Create the completion record
         model.createCompletionRecord(data, (error, results) => {
            if (error) {
                console.error("Error creating completion record:", error);
                return res.status(500).json({ error: "Internal Server Error", details: error });
            }

            res.status(201).json({
                complete_id: results.insertId,
                challenge_id: data.challenge_id,
                user_id: data.user_id,
                completed: data.completed,
                creation_date: data.creation_date,
                notes: data.notes,
            });
        });
    });
};



module.exports.readAllById = (req, res, next) => {
    const challengeId = req.params.id;

    model.readAllById(challengeId, (error, results) => {
        if (error) {
            console.error("Error retrieving participants:", error);
            return res.status(500).json({ error: "Internal Server Error", details: error });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No participants found for this challenge." });
        }

        const participants = results.map(participant => ({
            user_id: participant.user_id,
            completed: participant.completed,
            creation_date: participant.creation_date,
            notes: participant.notes
        }));

        return res.status(200).json(participants);
    });
};

module.exports.checkById = (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    model.checkById(userId, (error, completedChallenges) => {
        if (error) {
            console.error("Error fetching completed challenges:", error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }

        if (!completedChallenges.length) {
            res.status(404).json({ message: "No completed challenges found for this user." });
            return;
        }

        res.status(200).json(completedChallenges);
    });
};
