const express = require("express");
const router = express.Router();
const { createComment, getAllCommentUser, updateComment, removeComment } = require("../controllers/comment_controller.js");
const { isAuthenticatedUser, authRoles } = require("../middlewares/auth.js");

router.post("/add", isAuthenticatedUser, createComment);

router.get("/user/all/:id", isAuthenticatedUser, getAllCommentUser);
router.put("/edit/:id", isAuthenticatedUser, updateComment);

router.delete("/user/delete/:id", isAuthenticatedUser, removeComment);

module.exports = router;