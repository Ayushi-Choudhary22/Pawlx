const express = require('express');
const router = express.Router();
const temporaryAdoptionController = require('../controllers/temporaryAdoptionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', temporaryAdoptionController.createListing);
router.get('/', temporaryAdoptionController.listListings);
router.get('/my-dashboard', temporaryAdoptionController.getMyDashboard);
router.post('/listings/:id/connect', temporaryAdoptionController.sendConnectionRequest);
router.put('/requests/:requestId', temporaryAdoptionController.respondToRequest);

module.exports = router;
