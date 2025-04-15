const express = require(`express`);
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const customErr = require("../utils/Errs.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");



const validate = (schema)=> (req, res, next)=> {
    let {error} = schema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((detail)=> detail.message).join(",");
        throw new customErr(400, errMsg);
    } else {
        next();
    }
}

const validateReview = validate(reviewSchema);

/**
 * Now let's add the review into the database .
 */

// validate review is passed to validate the review from client side . . . 

router.post("/", validateReview, async (req, res)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

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
    res.redirect(`/listings/${id}`);
}));

module.exports = router;