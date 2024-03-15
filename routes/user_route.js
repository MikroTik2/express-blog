const express = require("express");
const router = express.Router();

const { getAllUser, getSingleUser, getUserDetails, updateProfile, updateRoleUser, deleteUser, } = require("../controllers/user_controller.js");
const { isAuthenticatedUser, authRoles } = require("../middlewares/auth.js");

router.get("/all", getAllUser);
router.get("/single/:id", isAuthenticatedUser, authRoles('admin'), getSingleUser);
router.get("/me", isAuthenticatedUser, getUserDetails);

router.put('/edit-profile', isAuthenticatedUser, updateProfile);
router.put('/edit-role/:id', isAuthenticatedUser, authRoles('admin'), updateRoleUser);

router.delete('/delete/:id', isAuthenticatedUser, authRoles('admin'), deleteUser);

module.exports = router;