const Blog = require("../models/db/blog_model.js");
const User = require("../models/db/user_model.js");
const Comment = require("../models/db/comment_model.js");
const ErrorHandler = require("../utils/error_handler.js");
const asyncHandler = require("../middlewares/async_handler.js");
const slugify = require("slugify");
const cloudinary = require("cloudinary");

const createComment = asyncHandler(async (req, res, next) => {
     const { blogId, text } = req.body;

     const comment = await Comment.create({
          text,
          author: req.user._id, 
     });

     await Blog.findByIdAndUpdate(blogId, {
          $push: { comments: comment._id },
     }, { new: true }).populate("comments");

     await User.findByIdAndUpdate(req.user.id, {
          $push: { comments: comment._id },
     }, { new: true }).populate("comments");

     res.status(201).json({
          success: true,
          comment
     });
});

// get all comment user;
const getAllCommentUser = asyncHandler(async (req, res, next) => {
     const user = await User.findById(req.params.id).populate("comments");

     res.status(200).json({
          success: true,
          comments: user.comments,
     });
});

const updateComment = asyncHandler(async (req, res, next) => {

     const comment = Comment.findByIdAndUpdate(req.params.id, {
          text: req?.body?.text,
     }, { new: true });

     res.json({
          success: true,
          comment,
     });
});

const removeComment = asyncHandler(async (req, res, next) => {
     const user = await User.findByIdAndUpdate(req.user.id, {
          $pull: { comments: req.params.id },
     }, { new: true });

     const blog = await Blog.findByIdAndUpdate(req.body.blogId, {
          $pull: { comments: req.params.id },
     }, { new: true });

     await Comment.findByIdAndDelete(req.params.id);

     res.status(200).json({
          success: true,
          user,
          blog,
     });
});

module.exports = {
     createComment,
     getAllCommentUser,
     updateComment,
     removeComment
};
