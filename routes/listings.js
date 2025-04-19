const express = require(`express`);
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const customErr = require("../utils/Errs.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

/**
 *      index router             GET         /listings
 */
router.get("/", wrapAsync(async (req, res)=> {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));


/**
 * create router for new listings
 * 
 *      GET             /listings/new           render the form
 *      POST            /listing                submit button and insert all details into DB 
 */isOwner

router.get("/new",isLoggedIn, (req, res) => {
    // if(!req.isAuthenticated()) {
    //     req.flash("error", "You must be logged in for new post");
    //     return res.redirect("/listings");
    // }
    res.render("./listings/new.ejs");
});

router.post("/", validateListing, wrapAsync(async (req, res, next)=> {  
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(`Listing Added Successfully . . . `);
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
}));

/**
 *      show router          GET         /listings/:id
 *      this router shows individual property's profile .
 */
router.get("/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const list = await Listing.findById(id).populate("reviews").populate("owner");
    if (!list) {
        req.flash("error", "The listing you are trying to access, does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {list});
}));

/**
 * create UPDATE route for listings
 * 
 *      GET     /listings/:id/edit      render a form for edit
 *      PUT     /listings/:id           submit -> render the updated values in show.ejs
 */

// edit route 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "The listing you are trying to access, does not exist");
    }
    res.render("./listings/edit.ejs", {listing});
}));

// update route 

router.put("/:id", isOwner, validateListing, wrapAsync(async (req, res)=> {
    let {id} = req.params;
   
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings`);
}));


// implement DELETE Route           "/listings/:id"

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`------------------------- Deleted Listing -------------------------`);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}));


module.exports = router;