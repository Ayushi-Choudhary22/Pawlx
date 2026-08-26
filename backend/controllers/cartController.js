const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const cartService = require('../services/cartService');
const wishlistService = require('../services/wishlistService');

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, cart, 'Cart fetched successfully').send(res);
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body.productId, req.body.quantity);
  new ApiResponse(HTTP_STATUS.OK, cart, 'Item added to cart').send(res);
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(req.user._id, req.params.productId, req.body.quantity);
  new ApiResponse(HTTP_STATUS.OK, cart, 'Cart updated').send(res);
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);
  new ApiResponse(HTTP_STATUS.OK, cart, 'Item removed from cart').send(res);
});

const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, null, 'Cart cleared').send(res);
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, wishlist, 'Wishlist fetched successfully').send(res);
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.toggleProduct(req.user._id, req.body.productId);
  new ApiResponse(HTTP_STATUS.OK, wishlist, 'Wishlist updated').send(res);
});

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  getWishlist,
  toggleWishlist,
};
