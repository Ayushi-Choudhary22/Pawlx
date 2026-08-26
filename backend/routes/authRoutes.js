const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} = require('../validators/authValidators');

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);
router.post('/forgot-password', forgotPasswordValidator, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validateRequest, authController.resetPassword);

router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.put(
  '/change-password',
  protect,
  changePasswordValidator,
  validateRequest,
  authController.changePassword
);

module.exports = router;
