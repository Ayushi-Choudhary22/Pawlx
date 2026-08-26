const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.put('/profile', protect, userController.updateProfile);
router.post('/avatar', protect, upload.single('avatar'), userController.uploadAvatar);
router.get('/professionals/:role', userController.listProfessionals);
router.get('/professional/:id', userController.getProfessionalById);

module.exports = router;
