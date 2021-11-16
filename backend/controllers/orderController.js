import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import nodemailer from 'nodemailer';

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
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @description: Update order to paid
// @route: GET /api/orders/:id/pay
// @access: Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const {
      address_line_1,
      admin_area_2,
      admin_area_1,
      postal_code,
      country_code,
    } = req.body.purchase_units[0].shipping.address;
    const { name, quantity, price } = order.orderItems[0];

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PW,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Info May Shop" <info@trilogywebsolutions.co.uk>', // sender address
      to: `${req.body.payer.email_address}, me@garyallin.uk`, // list of receivers
      subject: 'MayShop Order Confirmation', // Subject line
      text: 'MayShop Order Confirmation', // plain text body
      html: `
        <h1>Hi ${req.body.payer.name.given_name} ${req.body.payer.name.surname}!</h1>
        <p>Your ORDER for  ${quantity} X ${name} costing £ ${price} is being processed.</p>
        <p>You item will be shipped to the following address:</p>
        <p>${address_line_1}</p>
        <p>${admin_area_2}</p>
        <p>${admin_area_1}</p>
        <p>${postal_code}</p>
        <p>${country_code}</p>
        <small>We thank you for your order and your item(s) will be dispatched shortly.</small>

        `, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    const updateOrder = await order.save();
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @description: Update order to DELIVERED
// @route: GET /api/orders/:id/deliver
// @access: Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updateOrder = await order.save();
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @description: Get logged in user orders
// @route: GET /api/orders/myorders
// @access: Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @description: Get all orders
// @route: GET /api/orders
// @access: Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export {
  addOderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
