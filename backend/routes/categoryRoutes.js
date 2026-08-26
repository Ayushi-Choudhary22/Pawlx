const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.get('/', categoryController.listCategories);

router.use(protect, authorize(ROLES.ADMIN));
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
