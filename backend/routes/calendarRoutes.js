const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', calendarController.getMyCalendarEvents);

module.exports = router;
