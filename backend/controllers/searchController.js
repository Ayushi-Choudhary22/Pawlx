const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const searchService = require('../services/searchService');

// @desc    Global search across products, adoption listings, and professionals
// @route   GET /api/search?q=...
// @access  Public
const search = asyncHandler(async (req, res) => {
  const results = await searchService.globalSearch(req.query.q);
  new ApiResponse(HTTP_STATUS.OK, results, 'Search results fetched successfully').send(res);
});

module.exports = { search };
