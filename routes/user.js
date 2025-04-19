const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const passport = require("passport");
const {saveRedirects} = require("../middleware.js");

router.get("/signup", (req, res)=> {
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        let {email, username, password} = req.body;
        let newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        // register the user automatically when user signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            let flashMsg = `Welcome To Airbnb ${username}`;
            req.flash("success", flashMsg);
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// Login Functionality //

router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
});

/**
 * passport.authenticate("local", {failureRedirect : `/login`, failureFlash : true});
 * 
 *  failureRedirect : `/login`   -> If the authentication failed then it will automatically redirect to the same page
 *  failureFlash : true          -> If the authentication failed then it will flash a message that username and password wrong
 * 
 *  saveRedirects -> It is used to check where the user has clicked last time or where he want to visit before login .
 */

router.post("/login", saveRedirects, passport.authenticate("local", {failureRedirect : `/login`, failureFlash : true}), async (req, res) => {
    let {username} = req.body;
    let flashMsg = `Welcome Back ${username}`;
    req.flash("success", flashMsg);
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "Logout Successfully");
            res.redirect("/listings");
        }
    })
})

module.exports = router;