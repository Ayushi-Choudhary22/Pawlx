const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const productService = require('../services/productService');

const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  new ApiResponse(HTTP_STATUS.OK, result, 'Products fetched successfully').send(res);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  new ApiResponse(HTTP_STATUS.OK, product, 'Product fetched successfully').send(res);
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts();
  new ApiResponse(HTTP_STATUS.OK, products, 'Featured products fetched').send(res);
});

const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await productService.getTrendingProducts();
  new ApiResponse(HTTP_STATUS.OK, products, 'Trending products fetched').send(res);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  new ApiResponse(HTTP_STATUS.CREATED, product, 'Product created successfully').send(res);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  new ApiResponse(HTTP_STATUS.OK, product, 'Product updated successfully').send(res);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  new ApiResponse(HTTP_STATUS.OK, null, 'Product removed successfully').send(res);
});

module.exports = {
  listProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTrendingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
