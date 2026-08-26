const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { applyForAdoptionValidator, createAdoptionValidator } = require('../validators/adoptionValidators');
const upload = require('../config/multer');
const ROLES = require('../constants/roles');

router.get('/', adoptionController.listAdoptions);
router.get('/:id', adoptionController.getAdoptionById);

router.use(protect);

router.post('/', createAdoptionValidator, validateRequest, adoptionController.createAdoption);
router.post(
  '/:id/apply',
  upload.single('idProof'),
  applyForAdoptionValidator,
  validateRequest,
  adoptionController.applyForAdoption
);
router.get('/applications/my', adoptionController.getMyApplications);
router.put('/applications/:appId/review', authorize(ROLES.ADMIN), adoptionController.reviewApplication);

module.exports = router;
