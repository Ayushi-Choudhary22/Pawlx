const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetController');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const ROLES = require('../constants/roles');

// Public: browse/search veterinarians (filters: city, minRating)
router.get('/', (req, res, next) => {
  req.params.role = ROLES.VETERINARIAN;
  next();
}, userController.listProfessionals);

router.use(protect);

router.post('/appointments', authorize(ROLES.PET_OWNER), vetController.bookAppointment);
router.get('/appointments/my', authorize(ROLES.PET_OWNER), vetController.getMyAppointments);
router.put('/appointments/:id/cancel', authorize(ROLES.PET_OWNER), vetController.cancelAppointment);
router.put(
  '/appointments/:id/reschedule',
  authorize(ROLES.PET_OWNER),
  vetController.rescheduleAppointment
);

router.get('/appointments/queue', authorize(ROLES.VETERINARIAN), vetController.getVetQueue);
router.put('/appointments/:id/status', authorize(ROLES.VETERINARIAN), vetController.updateStatus);

module.exports = router;
