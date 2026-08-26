const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.get('/', productController.listProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/trending', productController.getTrendingProducts);
router.get('/:slug', productController.getProductBySlug);

router.use(protect, authorize(ROLES.ADMIN));
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
