const express = require(`express`);
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");

/**
 *      index router             GET         /listings
 */

router.route("/").get(wrapAsync(listingController.index)).post(validateListing, wrapAsync(listingController.postNewListing));


/**
 * create router for new listings
 * 
 *      GET             /listings/new           render the form
 *      POST            /listing                submit button and insert all details into DB 
 */

router.get("/new",isLoggedIn, listingController.newListing);
router.route("/:id").get(wrapAsync(listingController.showListing)).put(isOwner, validateListing, wrapAsync(listingController.updateListing)).delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
// edit route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;