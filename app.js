if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const {createWebCryptoAdapter} = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const connectDB = require("./database/dbConnection.js");

// Import Models & Utils
const User = require("./models/user.js");
const customErr = require("./utils/Errs.js");

// Import Routes (Crucial for MVC)
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Connect to DB immediately
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);

// Session Configuration
// const store = MongoStore.create({
//   mongoUrl: process.env.MONGODB_URL,
//   cryptoAdapter: createWebCryptoAdapter({
//     secret: process.env.SESSION_SECRET,
//   }),
//   touchAfter: 24 * 3600,
// });

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get("/", (req, res) => {
//     res.send("Server is running fine . . .");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/", listingRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Handler
app.all("*", (req, res, next) => {
    next(new customErr(404, "Page Not Found"));
});

// Error Handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Something Damaged" } = err;
    // Optional: render an error template instead of sending raw text
    res.status(status).render("error.ejs", { message }); 
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listing to port ${process.env.PORT}`);
});