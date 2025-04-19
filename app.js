const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const dbPath = "mongodb://127.0.0.1:27017/airbnb";
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const customErr = require("./utils/Errs.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const loggerMiddleware = require("./middleware/loggerMiddleware.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LoaclStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);


const sessionOptions = {
    secret : "mysecretkey",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 , // 3 days from now
        maxAge : 7 * 24 * 60 * 60 * 1000,    // 7 Days 
        httOnly : true
    }
};


app.get("/", (req, res)=> {
    res.send("Server is running fine . . .");
});


app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LoaclStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;          // currect user session
    next();
})

const listingRouter = require(`./routes/listings.js`);
const reviewsRouter = require(`./routes/review.js`);
const userRouter = require(`./routes/user.js`);
/**
 * Set up the mongo db
 */

main().then(()=> {
    console.log("Connect To DB Succefully . . .");
}).catch((err)=> {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbPath);
}

// implementing listing routes

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


/**
 * Handling Error 
 */

// It handles all the errors if any of the API path is not match . . .

app.all("*", ( req, res, next)=> {
    next(new customErr(404, "Page Not Found"));
});

app.use((err, req, res, next)=> {
    let{status = 500, message = "Something Damaged"} = err;
    res.status(status).send(message);
});


// ---------------------------------------------------------------------------------------
// start the server //
app.listen(8000, ()=> {
    console.log("Listining to port : 8000");
});