const reviewModel = require('../models/reviewModel');

// Create a review
module.exports.createReview = (req, res) => {
    const { challenge_id, rating, comment } = req.body;
    const user_id = req.user.user_id;

    if (!challenge_id || !rating) {
        return res.status(400).json({ error: "Challenge ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    reviewModel.createReview({ user_id, challenge_id, rating, comment }, (err, result) => {
        if (err) {
            console.error("Error inserting review:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json({ message: "Review added successfully" });
    });
};

// Get all reviews
module.exports.getAllReviews = (req, res) => {
    reviewModel.getAllReviews((err, results) => {
        if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results);
    });
};

// Get reviews for a specific user
module.exports.getReviewsById = (req, res) => {
    const user_id = req.params.user_id;
    reviewModel.getReviewsById(user_id, (err, results) => {
        if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results);
    });
};

// Get reviews for a specific challenge
module.exports.getReviewsByChallenge = (req, res) => {
    const { challenge_id } = req.params;
    reviewModel.getReviewsByChallenge(challenge_id, (err, results) => {
        if (err) {
            console.error("Error fetching challenge reviews:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results);
    });
};

// Update a review
module.exports.updateReview = (req, res) => {
    const { review_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.user_id;

    reviewModel.updateReview({ review_id, user_id, rating, comment }, (err, result) => {
        if (err) {
            console.error("Error updating review:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Unauthorized to update this review" });
        }

        res.status(200).json({ message: "Review updated successfully" });
    });
};

// Delete a review
module.exports.deleteReview = (req, res) => {
    const { review_id } = req.params;
    const user_id = req.user.user_id;

    reviewModel.deleteReview(review_id, user_id, (err, result) => {
        if (err) {
            console.error("Error deleting review:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Unauthorized to delete this review" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    });
};
