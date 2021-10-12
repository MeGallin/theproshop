import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @description: Creat new order
// @route: GET /api/orders
// @access: Private
const addOderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    //Save to DB
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @description: get order by ID
// @route: GET /api/orders/:id
// @access: Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email',
  );
  if (order) {
    res.status(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { addOderItems, getOrderById };
