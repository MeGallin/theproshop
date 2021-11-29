import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';

// @description: Authenticate a user and get a token
// @route: POST /api/users/login
// @access: Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid user name or password');
  }
});

// @description: User Profile
// @route: GET /api/users/profile
// @access: PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('No user found');
  }
});

// @description: Register new user
// @route: POST /api/users
// @access: Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });

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

    const link = `http://localhost:5000/verify/id=${generateToken(user._id)}`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Info May Shop" <info@trilogywebsolutions.co.uk>', // sender address
      to: `${user.email}, me@garyallin.uk`, // list of receivers
      subject: 'MayShop Registration', // Subject line
      text: 'MayShop Registration', // plain text body
      html: `
    <h1>Hi ${user.name}</h1>
    <p>You are successfully registered with MayShop</p>
    <p>Please Click on the link to verify your email.
    <br>
    <a href=${link}>Click here to verify</a>
    </p>
     
    `, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } else {
    res.status(400);
    throw new Error('Ivqlid user data');
  }
});

// @description: UPdate User Profile
// @route: PUT /api/users/profile
// @access: PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('No user found');
  }
});

// @description: Get all users
// @route: GET /api/users
// @access: PRIVATE/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @description: Delete a single user
// @route: DELETE /api/users/:id
// @access: PRIVATE/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User successfully removed' });
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

// @description: Get user by UD
// @route: GET /api/users/:id
// @access: PRIVATE/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User Not Found');
  }
});

// @description: UPdate User
// @route: PUT /api/users/:id
// @access: PRIVATE/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('No user found');
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
};
