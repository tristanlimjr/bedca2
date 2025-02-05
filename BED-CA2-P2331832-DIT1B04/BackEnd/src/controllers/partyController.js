const model = require('../models/partyModel')

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

module.exports.createParty = (req, res, next) =>
{
    model.findParty(req.body.party_name, (error, results) => 
    {
        if (error) {
        console.error("Error checking party:", error);
        return res.status(500).send("Internal server error.");
        }
        
        if (results.length > 0) {
            return res.status(409).send("Error: Party Name already exists.");
        }

    if(req.body.user_id == undefined)
    {
        res.status(400).send("Error: leader_id is undefined");
        return;
    }
    
    const data = {
        party_name: req.body.party_name,
        leader_id: req.body.user_id,
        creation_date: req.body.creation_date
    }
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error creating new user:", error);
            res.status(500).json({ error: "Internal Server Error", details: error });
        } else {
            console.log("User created successfully:", results);
            res.status(201).json({
                party_id: results.insertId,
                party_name: req.body.party_name,
                leader_id: req.body.user_id,
                creation_date: req.body.creation_date
            });
        }
    };
            
    model.insertSingle(data, callback);
})
};

module.exports.addMember = (req, res, next) => {
    if (req.body.user_id === undefined) {
        return res.status(400).json({
            message: "Error: User ID is required"
        });
    }

    const party_id = req.params.id;
    const user_id = req.body.user_id;

    model.checkMemberExists(party_id, user_id, (error, exists) => {
        if (error) {
            return res.status(500).json({
                message: "Database error",
                error: error
            });
        }

        if (exists) {
            return res.status(400).json({
                message: "User is already a member of the party"
            });
        }

        model.addMemberToParty(party_id, user_id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    message: "Error adding member to party",
                    error: error
                });
            }

            return res.status(201).json({
                message: "Member added to party successfully",
                party_id: party_id,
                user_id: user_id
            });
        });
    });
};

module.exports.viewMembers = (req, res, next) => {
    const data = {
        party_id: req.params.id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error findPartyById:", error);
            res.status(500).json(error);
        } else {
            if (!results || results.length === 0) {
                res.status(404).json({ message: "Party not found." });
            } else {
                const party = {
                    party_id: results[0].party_id,
                    party_name: results[0].party_name,
                    leader: results[0].leader_name,
                    members: results.map(member => ({
                        user_id: member.user_id,
                        username: member.username
                    }))
                };

                res.status(200).json(party);
            }
        }
    };

    model.getAllMembers(data.party_id, callback);
};

module.exports.kickMember = (req, res, next) => {
    const party_id = req.params.id;
    const user_id = req.body.user_id;

    if (!user_id) {
        return res.status(400).json({
            message: "Error: user_id is required"
        });
    }

    model.checkMemberExists(party_id, user_id, (error, exists) => {
        if (error) {
            return res.status(500).json({
                message: "Error checking member existence",
                error: error
            });
        }

        if (!exists) {
            return res.status(404).json({
                message: "User is not a member of the party"
            });
        }

        model.kickMemberFromParty(party_id, user_id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    message: "Error kicking member from the party",
                    error: error
                });
            }

            return res.status(200).json({
                message: "User has been kicked from the party",
                party_id: party_id,
                user_id: user_id
            });
        });
    });
};

module.exports.deleteParty = (req, res, next) => {
    const data = {
        id: req.params.id
    }
            
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteParty:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Party not found"
                });
            }
            else res.status(204).send();       
        }
    }
            
    model.deleteById(data, callback);
}

module.exports.findPartyByUserId = (req, res, next) => {
    const data = {
        user_id: req.params.userId
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error findPartyByUserId:", error);
            res.status(500).json(error);
        } else {
            if (!results || results.length === 0) {
                res.status(404).json({
                    message: "User is not in any party."
                });
            } else {
                res.status(200).json(results[0]);
            }
        }
    };

    model.findPartyByUserId(data, callback);
};


