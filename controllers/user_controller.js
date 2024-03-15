const User = require("../models/db/user_model.js");
const ErrorHandler = require("../utils/error_handler.js");
const asyncHandler = require("../middlewares/async_handler.js");

// find all user
const getAllUser = asyncHandler(async (req, res, next) => {
     const users = await User.find();

     res.status(200).json({
          success: true,
          users,
     });
});

const getUserDetails = asyncHandler(async (req, res) => {
     const user = await User.findById(req.user.id);
     console.log(user);

     res.status(200).json({
          success: true,
          user,
     });
});

const getSingleUser = asyncHandler(async (req, res, next) => {

     const user = await User.findById(req.params.id);
     if (!user) return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));

     res.status(200).json({
          success: true,
          user,
     });
});

const updateProfile = asyncHandler(async (req, res, next) => {
     const user = await User.findByIdAndUpdate(req.user.id, {
          username: req?.body?.username,
          avatar: req?.body?.avatar,
     }, { new: true, runValidators: true, useFindAndModify: true });

     res.status(200).json({
          success: true,
          user,
     });
});

const updateRoleUser = asyncHandler(async (req, res, next) => {
     const user = await User.findByIdAndUpdate(req.params.id, {
          role: req?.body?.role,
     }, { new: true, runValidators: true, useFindAndModify: true });

     res.status(200).json({
          success: true,
          user,
     });
})

const deleteUser = asyncHandler(async (req, res, next) => {
     const user = await User.findByIdAndDelete(req.params.id);

     res.status(200).json({
          success: true,
          user,
     });
});

module.exports = {
     getAllUser,
     getUserDetails,
     getSingleUser,
     updateProfile,
     updateRoleUser,
     deleteUser,
};
