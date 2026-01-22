const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const {saveRedirects} = require("../middleware.js");

const userController = require("../controller/user");

router.route("/signup").get(userController.signUpPage).post(wrapAsync(userController.signUp));
router.route("/login").get(userController.loginPage).post(saveRedirects, passport.authenticate("local", {failureRedirect : `/login`, failureFlash : true}), userController.login);

/**
 * passport.authenticate("local", {failureRedirect : `/login`, failureFlash : true});
 * 
 *  failureRedirect : `/login`   -> If the authentication failed then it will automatically redirect to the same page
 *  failureFlash : true          -> If the authentication failed then it will flash a message that username and password wrong
 * 
 *  saveRedirects -> It is used to check where the user has clicked last time or where he want to visit before login .
 */

router.get("/logout", userController.logout)

module.exports = router;