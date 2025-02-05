const model = require('../models/userModel')

module.exports.createNewUser = (req, res, next) =>
{
    model.findByUsername(req.body.username, (error, results) => {
        if (error) {
          console.error("Error checking username:", error);
          return res.status(500).send("Internal server error.");
        }
    
        if (results.length > 0) {
          return res.status(409).send("Error: Username already exists.");
    }
        
    const data = {
        username: req.body.username,
        skillpoints: 0,
    }
    
    if(data.username == undefined)
        {
            res.status(400).send("Error: username is undefined");
            return;
        };
        
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error creating new user:", error);
            res.status(500).json({ error: "Internal Server Error", details: error });
        } else {
            console.log("User created successfully:", results);
            res.status(201).json({
                user_id: results.insertId,
                username: data.username,
                skillpoints: data.skillpoints
            });
        }
    };
        
    model.insertSingle(data, callback);
})
};

module.exports.readAllUsers = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUsers:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }
    model.selectAll(callback);
}

module.exports.updateUserById = (req, res, next) => {
    if (req.params.id == undefined) {
        return res.status(400).json({
            message: "Error: User ID is undefined"
        });
    }

    model.selectById(req.params.id, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Internal Server Error", details: error });
        }

        if (!results) {
            return res.status(404).json({ message: "User not found." });
        }

        model.findByUsername(req.body.username, (error, usernameResults) => {
            if (error) {
                console.error("Error checking username:", error);
                return res.status(500).send("Internal server error.");
            }
        
            if (!usernameResults || usernameResults.length === 0) {
                return res.status(400).send("Error: Username not found.");
            }

            const data = {
                user_id: req.params.id,
                username: req.body.username,
                skillpoints: req.body.skillpoints,
            };

            const callback = (error, updateResults, fields) => {
                if (error) {
                    console.error("Error updating user:", error);
                    return res.status(500).json({ error: "Internal Server Error", details: error });
                }

                console.log("User updated successfully:", updateResults);
                return res.status(200).json({
                    user_id: req.params.id,
                    username: req.body.username,
                    skillpoints: req.body.skillpoints
                });
            };

            model.updateById(data, callback);
        });
    });
};

module.exports.getUserByUsername = (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    model.findByUsername(username, (error, user) => {
        if (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            skillpoints: user.skillpoints,
            level: user.level
        });
    });
};

module.exports.updateSkillpoints = (req, res, next) => {
    const userId = req.params.userId;
    const skillpoints = req.body.skillpoints;

    if (!userId || skillpoints === undefined) {
        return res.status(400).json({ message: "User ID and skillpoints value are required." });
    }

    model.updateSkillpoints(userId, skillpoints, (error, result) => {
        if (error) {
            console.error("Error updating skillpoints:", error);
            return res.status(500).json({ message: "Internal server error", details: error });
        }
    });
};

module.exports.updateSkillpointsChallenge = (req, res) => {
    if (!skillpointsAdded) {
        return res.status(400).json({ message: "Skillpoints data missing" });
    }

    model.updateSkillpoints(req.body.user_id, skillpointsAdded, (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Failed to update skillpoints", error });
        }
    
        console.log("Skillpoints updated successfully");
    }
)};

module.exports.getTotalUsers = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getTotalUsers:", error);
            res.status(500).json({ message: "Error fetching user count", error });
        } 
        else res.status(200).json({ count: results[0].total });
    };
    
    model.getTotalUsers(callback);
};
