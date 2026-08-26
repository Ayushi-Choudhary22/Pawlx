const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const HTTP_STATUS = require('../constants/httpStatus');
const orderService = require('../services/orderService');

const placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user._id, req.body);
  new ApiResponse(HTTP_STATUS.CREATED, order, 'Order placed successfully').send(res);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);
  new ApiResponse(HTTP_STATUS.OK, orders, 'Orders fetched successfully').send(res);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id);
  new ApiResponse(HTTP_STATUS.OK, order, 'Order fetched successfully').send(res);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.body.note);
  new ApiResponse(HTTP_STATUS.OK, order, 'Order status updated').send(res);
});

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
