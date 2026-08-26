const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return Cart.findById(cart._id).populate('items.product', 'name images price discountPrice stock');
};

const addItem = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  if (product.stock < quantity) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Insufficient stock');

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      priceAtAdd: product.discountPrice || product.price,
    });
  }

  await cart.save();
  return getCart(userId);
};

const updateItemQuantity = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Item not in cart');

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  return getCart(userId);
};

const removeItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  return getCart(userId);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.couponCode = undefined;
  cart.discountAmount = 0;
  await cart.save();
  return cart;
};

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart };
