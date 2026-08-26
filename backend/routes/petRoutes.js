const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { createPetValidator, updatePetValidator } = require('../validators/petValidators');
const upload = require('../config/multer');

router.use(protect); // every pet route requires authentication

router.route('/')
  .post(createPetValidator, validateRequest, petController.createPet)
  .get(petController.getMyPets);

router.route('/:id')
  .get(petController.getPetById)
  .put(updatePetValidator, validateRequest, petController.updatePet)
  .delete(petController.deletePet);

router.post('/:id/photo', upload.single('photo'), petController.uploadPetPhoto);

module.exports = router;
