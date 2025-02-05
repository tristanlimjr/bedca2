const pool = require('../services/db');

// Create a new review
module.exports.createReview = (data, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO Review (user_id, challenge_id, rating, comment)
        VALUES (?, ?, ?, ?);
    `;
    const VALUES = [data.user_id, data.challenge_id, data.rating, data.comment];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// Get all reviews
module.exports.getAllReviews = (callback) => {
    const SQL_STATEMENT = `SELECT * FROM Review;`;
    pool.query(SQL_STATEMENT, callback);
};

// Get reviews by challenge ID
module.exports.getReviewsByChallenge = (challenge_id, callback) => {
    const SQL_STATEMENT = `
        SELECT * FROM Review WHERE challenge_id = ?;
    `;
    pool.query(SQL_STATEMENT, [challenge_id], callback);
};

// Get reviews by user ID
module.exports.getReviewsById = (user_id, callback) => {
    const SQL_STATEMENT = `
        SELECT * FROM Review WHERE user_id = ?;
    `;
    pool.query(SQL_STATEMENT, [user_id], callback);
};

// Update a review
module.exports.updateReview = (data, callback) => {
    const SQL_STATEMENT = `
        UPDATE Review
        SET rating = ?, comment = ?
        WHERE review_id = ? AND user_id = ?;
    `;
    const VALUES = [data.rating, data.comment, data.review_id, data.user_id];

    pool.query(SQL_STATEMENT, VALUES, callback);
};

// Delete a review
module.exports.deleteReview = (review_id, user_id, callback) => {
    const SQL_STATEMENT = `
        DELETE FROM Review WHERE review_id = ? AND user_id = ?;
    `;
    pool.query(SQL_STATEMENT, [review_id, user_id], callback);
};
