const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const customErr = require("./utils/Errs.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {

    /**
     * We are implementing the authentication, it will check user is already logged in or not 
     */
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirects = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "Permission Denied");
        return res.redirect(`/listings/${id}`);
    }

    next();
}


module.exports.validateListing = (req, res, next)=> {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((detail)=> detail.message).join(",");
        throw new customErr(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next)=> {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((detail)=> detail.message).join(",");
        throw new customErr(400, errMsg);
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "Permission Denied");
        return res.redirect(`/listings/${id}`);
    }

    next();
}