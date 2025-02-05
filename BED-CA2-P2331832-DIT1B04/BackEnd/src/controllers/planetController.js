const model = require('../models/planetModel.js');

module.exports.getAllPlanets = (req, res, next) => {
    model.selectAll((error, results) => {
        if (error) {
            console.error("Error getAllPlanets:", error);
            res.status(500).json(error);
        } else res.status(200).json(results);
    });
};

module.exports.getPlanetById = (req, res, next) => {
    model.selectById(req.params.id, (error, results) => {
        if (error) {
            console.error("Error getPlanetById:", error);
            res.status(500).json(error);
        } else res.status(200).json(results);
    });
};

module.exports.addPlanet = (req, res, next) => {
    model.insert(req.body, (error, results) => {
        if (error) {
            console.error("Error addPlanet:", error);
            res.status(500).json(error);
        } else res.status(201).json({ message: "Planet added successfully", planet_id: results.insertId });
    });
};

module.exports.updatePlanet = (req, res, next) => {
    model.update(req.params.id, req.body, (error, results) => {
        if (error) {
            console.error("Error updatePlanet:", error);
            res.status(500).json(error);
        } else res.status(200).json({ message: "Planet updated successfully" });
    });
};

module.exports.deletePlanet = (req, res, next) => {
    model.delete(req.params.id, (error, results) => {
        if (error) {
            console.error("Error deletePlanet:", error);
            res.status(500).json(error);
        } else res.status(200).json({ message: "Planet deleted successfully" });
    });
};
