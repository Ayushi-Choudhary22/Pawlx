const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/chat', aiController.sendMessage);
router.get('/conversations', aiController.getMyConversations);
router.get('/conversations/:id', aiController.getConversationById);

module.exports = router;
