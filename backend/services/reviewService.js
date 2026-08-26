const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const targetModelMap = {
  product: 'Product',
  veterinarian: 'User',
  pet_sitter: 'User',
  groomer: 'User',
};

const recalculateRating = async (targetType, targetId) => {
  const reviews = await Review.find({ targetType, targetId });
  const totalReviews = reviews.length;
  const rating = totalReviews ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  if (targetType === 'product') {
    await Product.findByIdAndUpdate(targetId, { rating, totalReviews });
  } else {
    await User.findByIdAndUpdate(targetId, {
      'professionalProfile.rating': rating,
      'professionalProfile.totalReviews': totalReviews,
    });
  }
};

const createReview = async (userId, { targetType, targetId, rating, comment }) => {
  const targetTypeRef = targetModelMap[targetType];
  if (!targetTypeRef) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid review target type');

  const review = await Review.create({
    user: userId,
    targetType,
    targetId,
    targetTypeRef,
    rating,
    comment,
  });

  await recalculateRating(targetType, targetId);
  return review;
};

const getReviewsForTarget = async (targetType, targetId) =>
  Review.find({ targetType, targetId }).populate('user', 'name avatar').sort({ createdAt: -1 });

const markHelpful = async (reviewId) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  );
  if (!review) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Review not found');
  return review;
};

module.exports = { createReview, getReviewsForTarget, markHelpful };
