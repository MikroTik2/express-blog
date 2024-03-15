const Blog = require("../models/db/blog_model.js");
const User = require("../models/db/user_model.js");
const ErrorHandler = require("../utils/error_handler.js");
const asyncHandler = require("../middlewares/async_handler.js");
const slugify = require("slugify");
const cloudinary = require("cloudinary");

// create blog
const createBlog = asyncHandler(async (req, res, next) => {

     let images = [];

     if (typeof req.body.images === "string") {

          images.push(req.body.images);

     } else {
          images = req.body.images;
     };

     const imagesLink = [];

     for (let i = 0; i < images.length; i++) {

          const result = await cloudinary.v2.uploader.upload(images[i], {
               folder: "blogs",
          });
          
          imagesLink.push({
               public_id: result.public_id,
               url: result.secure_url,
          });
     };

     const blog = await Blog.create({
          title: req.body.title,
          description: req.body.description,
          slug: slugify(req.body.title),
          images: imagesLink,
          author: req.user.id,
     });

     res.status(201).json({
          success: true,
          blog,
     });
});

// get all blog
const getAllBlog = asyncHandler(async (req, res, next) => {
     const blogs = await Blog.find().populate("author");

     res.status(200).json({
          success: true,
          blogs,
     });
});

// blog details
const getBlog = asyncHandler(async (req, res, next) => {
     const blog = await Blog.findById(req.params.id)
          .populate("dislikes")
          .populate("likes")
          .populate("author")
          .populate("comments");
          
     const views = await Blog.findByIdAndUpdate(req.params.id, {
          $inc: { numViews: 1 },
     }, { new: true });

     res.status(200).json({
          success: true,
          blog,
     });
});

// like blog
const likeBlog = asyncHandler(async (req, res, next) => {
     const { blogId } = req.body;

     const blog = await Blog.findById(blogId);
     const loginUserId = req.user.id;
     const isLiked = blog?.isLiked;

     const alreadyDisliked = blog?.dislikes?.find(
          (userId) => userId?.toString() === loginUserId?.toString()
     );

     if (alreadyDisliked) {
          const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
               $pull: { dislikes: loginUserId },
               isDisliked: false,
          }, { new: true });
      
          res.status(200).json({
               success: true,
               blog: updatedBlog,
          });
      
     };

     if (isLiked) {
          const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
               $pull: { likes: loginUserId },
               isLiked: false,
          }, { new: true });

          res.status(200).json({
               success: true,
               blog: updatedBlog,
          });

     } else {
          const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
               $push: { likes: loginUserId },
               isLiked: true,
          }, { new: true });

          res.status(200).json({
               success: true,
               blog: updatedBlog,
          });
     };
});

// dislike blog
const dislikeBlog = asyncHandler(async (req, res, next) => {
     const { blogId } = req.body;

     const blog = await Blog.findById(blogId);
     const loginUserId = req.user.id;
     const isDisliked = blog?.isDisliked;

     const alreadyLiked = blog?.likes?.find(
          (userId) => userId?.toString() === loginUserId?.toString()
     );

     if (alreadyLiked) {
          const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
               $pull: { likes: loginUserId },
               isLiked: false,
          }, { new: true });
      
          res.status(200).json({
               success: true,
               blog: updatedBlog,
          });
      
     };

     if (isDisliked) {
          const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
               $pull: { dislikes: loginUserId },
               isDisliked: false,
          }, { new: true });
      
          res.status(200).json({
               success: true,
               blog: updatedBlog,
          });
      
     } else {
          const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
               $push: { dislikes: loginUserId },
               isDisliked: true,
          }, { new: true });
      
          res.status(200).json({
               success: true,
               blog: updatedBlog,
          });
      
     };
});

// update blog
const updateBlog = asyncHandler(async (req, res, next) => {

     let images = [];

     if (typeof req.body.images === "string") {

          images.push(req.body.images);

     } else {
          images = req.body.images;
     };

     const imagesLink = [];

     for (let i = 0; i < images.length; i++) {

          const result = await cloudinary.v2.uploader.upload(images[i], {
               folder: "blogs",
          });
          
          imagesLink.push({
               public_id: result.public_id,
               url: result.secure_url,
          });
     };

     const blog = await Blog.findByIdAndUpdate(req.params.id, {
          title: req.body.title,
          description: req.body.description,
          slug: slugify(req.body.title),
          images: imagesLink,
          author: req.user.id,
     });

     res.status(200).json({
          success: true,
          blog,
     });
});

// delete blog
const deleteDetail = asyncHandler(async (req, res, next) => {
     const blog = await Blog.findByIdAndDelete(req.params.id).populate("author");

     res.status(200).json({
          success: true,
          blog,
     });
});

module.exports = { createBlog, getAllBlog, getBlog, likeBlog, dislikeBlog, updateBlog, deleteDetail };