const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const HTTP_STATUS = require('../constants/httpStatus');

const generateOrderNumber = () => `PWX-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

const placeOrder = async (userId, { shippingAddress, paymentMethod }) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Your cart is empty');
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0]?.url || '',
    price: item.priceAtAdd,
    quantity: item.quantity,
  }));

  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 49;
  const discountAmount = cart.discountAmount || 0;
  const totalPrice = itemsPrice + shippingPrice - discountAmount;

  // Decrement stock for each purchased product
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, totalSold: item.quantity },
      })
    )
  );

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: userId,
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    discountAmount,
    shippingPrice,
    totalPrice,
    trackingHistory: [{ status: 'placed', note: 'Order placed successfully' }],
  });

  cart.items = [];
  cart.couponCode = undefined;
  cart.discountAmount = 0;
  await cart.save();

  return order;
};

const getMyOrders = async (userId) => Order.find({ user: userId }).sort({ createdAt: -1 });

const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
  return order;
};

const updateOrderStatus = async (orderId, status, note) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');

  order.status = status;
  order.trackingHistory.push({ status, note });
  if (status === 'delivered') order.deliveredAt = new Date();

  await order.save();
  return order;
};

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
