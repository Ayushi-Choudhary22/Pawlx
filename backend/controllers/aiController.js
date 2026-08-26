const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const aiService = require('../services/aiService');

const sendMessage = asyncHandler(async (req, res) => {
  const history = await aiService.sendMessage(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.OK, history, 'AI response generated').send(res);
});

const getMyConversations = asyncHandler(async (req, res) => {
  const conversations = await aiService.getMyConversations(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, conversations, 'Conversations fetched successfully').send(res);
});

const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await aiService.getConversationById(req.params.id, req.user._id);
  new ApiResponse(HTTP_STATUS.OK, conversation, 'Conversation fetched successfully').send(res);
});

module.exports = { sendMessage, getMyConversations, getConversationById };
