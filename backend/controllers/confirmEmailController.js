import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @description: UPdate User Profile
// @route: GET /api/verify:token
// @access: public
const updateConfirmEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log('GGG', user);

  if (user) {
    console.log('AAAA', user);
    user.isConfirmed = true;
    await user.save();
    return res.status(200).send({ message: 'Account Varified' });
  } else {
    res.status(404);
    throw new Error('No user found');
  }
});

export { updateConfirmEmail };
