const express = require("express");
const router = express.Router();
const { createBlog, getAllBlog, likeBlog, dislikeBlog, getBlog, updateBlog, deleteDetail } = require("../controllers/blog_controller.js");
const { isAuthenticatedUser, authRoles } = require("../middlewares/auth.js");

router.post("/add", isAuthenticatedUser, createBlog);

router.get("/all", getAllBlog);
router.get("/details/:id", getBlog);

router.put("/edit-blog/:id", isAuthenticatedUser, updateBlog);
router.put("/likes", isAuthenticatedUser, likeBlog);
router.put("/dislikes", isAuthenticatedUser, dislikeBlog);
router.put("/edit-blog/:id", isAuthenticatedUser, updateBlog);

router.delete("/edit-blog/:id", isAuthenticatedUser, deleteDetail);

module.exports = router;