const express = require("express");
const passport = require("passport");
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require("../controllers/auth_controller");

router.post("/register", register);
router.post("/login", login);
router.post("/password-forgot", forgotPassword);

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/api/auth/google/failure", successRedirect: "/api/auth/google/success"}));

router.put("/password/reset/:token", resetPassword);

module.exports = router;