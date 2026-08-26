const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.use(protect, authorize(ROLES.ADMIN));

router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.listUsers);
router.put('/users/:id/status', adminController.toggleUserActive);
router.put('/users/:id/approve', adminController.approveProfessional);
router.get('/orders', adminController.listAllOrders);
router.get('/adoption-applications/pending', adminController.listPendingAdoptionApplications);

module.exports = router;
