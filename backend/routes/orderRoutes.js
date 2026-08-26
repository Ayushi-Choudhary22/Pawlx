const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.use(protect);

router.post('/', orderController.placeOrder);
router.get('/my', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', authorize(ROLES.ADMIN), orderController.updateOrderStatus);

module.exports = router;
