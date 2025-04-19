const express = require(`express`);
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateReview} = require("../middleware.js")


/**
 * Now let's add the review into the database .
 */

// validate review is passed to validate the review from client side . . . 

router.post("/", isLoggedIn, validateReview,  async (req, res)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Added Successfully!");
    res.redirect(`/listings/${id}`);
});

/**
 * Implementing Delete The Review 
 * $pull -> this mongoose method is used to remove a specific match from a given array
 */

router.delete("/:reviewId", wrapAsync(async(req, res, next)=> {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;