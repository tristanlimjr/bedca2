const model = require('../models/colonyModel.js');

module.exports.getAllColonies = (req, res, next) => {
    model.selectAll((error, results) => {
        if (error) {
            console.error("Error getAllColonies:", error);
            res.status(500).json(error);
        } else res.status(200).json(results);
    });
};

module.exports.getColonyById = (req, res, next) => {
    model.selectById(req.params.id, (error, results) => {
        if (error) {
            console.error("Error getColonyById:", error);
            res.status(500).json(error);
        } else res.status(200).json(results);
    });
};

module.exports.addColony = (req, res, next) => {
    model.insert(req.body, (error, results) => {
        if (error) {
            console.error("Error addColony:", error);
            res.status(500).json(error);
        } else res.status(201).json({ message: "Colony added successfully" });
    });
};

module.exports.updateColony = (req, res, next) => {
    model.update(req.params.id, req.body, (error, results) => {
        if (error) {
            console.error("Error updateColony:", error);
            res.status(500).json(error);
        } else res.status(200).json({ message: "Colony updated successfully" });
    });
};

module.exports.deleteColony = (req, res, next) => {
    model.delete(req.params.id, (error, results) => {
        if (error) {
            console.error("Error deleteColony:", error);
            res.status(500).json(error);
        } else res.status(200).json({ message: "Colony deleted successfully" });
    });
};

module.exports.getColoniesByUserId = (req, res, next) => {
    const userId = req.params.user_id;
    
    model.selectByUserId(userId, (error, results) => {
        if (error) {
            console.error("Error getColoniesByUserId:", error);
            res.status(500).json(error);
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: "No colonies found for this user." });
            } else {
                res.status(200).json(results);
            }
        }
    });
};
