const Wishlist = require('../models/Wishlist');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
};

const getWishlist = async (userId) => {
  const wishlist = await getOrCreateWishlist(userId);
  return Wishlist.findById(wishlist._id).populate('products', 'name images price discountPrice rating');
};

const toggleProduct = async (userId, productId) => {
  const wishlist = await getOrCreateWishlist(userId);
  const index = wishlist.products.findIndex((p) => p.toString() === productId);

  if (index > -1) {
    wishlist.products.splice(index, 1);
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  return getWishlist(userId);
};

module.exports = { getWishlist, toggleProduct };
