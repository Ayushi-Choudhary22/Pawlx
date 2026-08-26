const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const reviewService = require('../services/reviewService');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, review, 'Review submitted successfully').send(res);
});

const getReviewsForTarget = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.params;
  const reviews = await reviewService.getReviewsForTarget(targetType, targetId);
  new ApiResponse(HTTP_STATUS.OK, reviews, 'Reviews fetched successfully').send(res);
});

const markHelpful = asyncHandler(async (req, res) => {
  const review = await reviewService.markHelpful(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, review, 'Marked as helpful').send(res);
});

module.exports = { createReview, getReviewsForTarget, markHelpful };
