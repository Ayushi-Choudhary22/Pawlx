const express = require('express');
const router = express.Router({ mergeParams: true });
const petCareController = require('../controllers/petCareController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.use(protect);

router.route('/:petId/vaccinations')
  .get(petCareController.getVaccinations)
  .post(petCareController.addVaccination);
router.route('/:petId/vaccinations/:id')
  .put(petCareController.updateVaccination)
  .delete(petCareController.deleteVaccination);

router.route('/:petId/medicines')
  .get(petCareController.getMedicines)
  .post(petCareController.addMedicine);
router.route('/:petId/medicines/:id')
  .put(petCareController.updateMedicine)
  .delete(petCareController.deleteMedicine);

router.route('/:petId/medical-records')
  .get(petCareController.getRecords)
  .post(petCareController.addRecord);
router.post(
  '/:petId/medical-records/:id/attachment',
  upload.single('document'),
  petCareController.uploadAttachment
);

module.exports = router;
