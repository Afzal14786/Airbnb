const User = require("../models/user.js");

module.exports.signUpPage = (req, res)=> {
    res.render("./users/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
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
}

module.exports.loginPage = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login = async (req, res) => {
    let {username} = req.body;
    let flashMsg = `Welcome Back ${username}`;
    req.flash("success", flashMsg);
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "Logout Successfully");
            res.redirect("/listings");
        }
    })
}