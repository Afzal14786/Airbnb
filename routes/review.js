const express = require(`express`);
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controller/review");

/**
 * Now let's add the review into the database .
 */

// validate review is passed to validate the review from client side . . . 

router.post("/", isLoggedIn, validateReview,  wrapAsync(reviewController.postReview));

/**
 * Implementing Delete The Review 
 * $pull -> this mongoose method is used to remove a specific match from a given array
 */

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;