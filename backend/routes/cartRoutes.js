const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:productId', cartController.updateItemQuantity);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
