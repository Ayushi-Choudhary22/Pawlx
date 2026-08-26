const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:targetType/:targetId', reviewController.getReviewsForTarget);

router.use(protect);
router.post('/', reviewController.createReview);
router.put('/:id/helpful', reviewController.markHelpful);

module.exports = router;
