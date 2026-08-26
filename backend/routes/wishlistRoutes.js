const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', cartController.getWishlist);
router.post('/toggle', cartController.toggleWishlist);

module.exports = router;
