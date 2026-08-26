const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const categoryService = require('../services/categoryService');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  new ApiResponse(HTTP_STATUS.OK, categories, 'Categories fetched successfully').send(res);
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  new ApiResponse(HTTP_STATUS.CREATED, category, 'Category created successfully').send(res);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  new ApiResponse(HTTP_STATUS.OK, category, 'Category updated successfully').send(res);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, null, 'Category removed successfully').send(res);
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
