const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
 
router.get('/', controller.getAllReviews);
router.get('/users/:user_id', controller.getReviewsById);
router.get('/:challenge_id', controller.getReviewsByChallenge);

router.post('/', authMiddleware, controller.createReview);
router.put('/:review_id', authMiddleware, controller.updateReview);
router.delete('/:review_id', authMiddleware, controller.deleteReview);

module.exports = router;
