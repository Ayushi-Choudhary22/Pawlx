const express = require('express');
const router = express.Router();
const groomingController = require('../controllers/groomingController');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

router.get(
  '/',
  (req, res, next) => {
    req.params.role = ROLES.GROOMER;
    next();
  },
  userController.listProfessionals
);

router.use(protect);

router.post('/bookings', authorize(ROLES.PET_OWNER), groomingController.createBooking);
router.get('/bookings/my', authorize(ROLES.PET_OWNER), groomingController.getMyBookings);
router.put('/bookings/:id/cancel', authorize(ROLES.PET_OWNER), groomingController.cancelBooking);

router.get('/bookings/queue', authorize(ROLES.GROOMER), groomingController.getGroomerQueue);
router.put('/bookings/:id/status', authorize(ROLES.GROOMER), groomingController.updateStatus);

module.exports = router;
