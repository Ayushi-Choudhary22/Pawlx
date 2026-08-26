const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const listProducts = async (query = {}) => {
  const filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.petType) filter.petType = query.petType;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.search) filter.$text = { $search: query.search };

  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    bestselling: { totalSold: -1 },
  };
  const sort = sortMap[query.sort] || { createdAt: -1 };

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, pages: Math.ceil(total / limit) };
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true }).populate('category', 'name slug');
  if (!product) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  return product;
};

const getFeaturedProducts = async () => Product.find({ isFeatured: true, isActive: true }).limit(12);

const getTrendingProducts = async () =>
  Product.find({ isActive: true }).sort({ totalSold: -1 }).limit(12);

const createProduct = async (data) => Product.create(data);

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!product) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  return product;
};

module.exports = {
  listProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTrendingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
