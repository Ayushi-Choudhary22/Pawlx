const express = require('express');
const router = express.Router();
const petSitterController = require('../controllers/petSitterController');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.get(
  '/',
  (req, res, next) => {
    req.params.role = ROLES.PET_SITTER;
    next();
  },
  userController.listProfessionals
);

router.use(protect);

router.post('/bookings', authorize(ROLES.PET_OWNER), petSitterController.createBooking);
router.get('/bookings/my', authorize(ROLES.PET_OWNER), petSitterController.getMyBookings);
router.put('/bookings/:id/cancel', authorize(ROLES.PET_OWNER), petSitterController.cancelBooking);

router.get('/bookings/queue', authorize(ROLES.PET_SITTER), petSitterController.getSitterQueue);
router.put('/bookings/:id/status', authorize(ROLES.PET_SITTER), petSitterController.updateStatus);

module.exports = router;
