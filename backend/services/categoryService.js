const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const slugify = (name) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const listCategories = async () => Category.find({ isActive: true }).sort({ name: 1 });

const createCategory = async (data) => {
  const slug = slugify(data.name);
  const existing = await Category.findOne({ slug });
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, 'A category with this name already exists');

  return Category.create({ ...data, slug });
};

const updateCategory = async (id, data) => {
  const updates = { ...data };
  if (data.name) updates.slug = slugify(data.name);

  const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!category) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!category) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Category not found');
  return category;
};

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
