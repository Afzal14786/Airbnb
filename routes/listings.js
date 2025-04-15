const express = require(`express`);
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const customErr = require("../utils/Errs.js");
const {listingSchema} = require("../schema.js");
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

const validateListing = validate(listingSchema);


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
 */

router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

router.post("/", validateListing, wrapAsync(async (req, res, next)=> {  
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(`Listing Added Successfully . . . `);
    res.redirect("/listings");
}));

/**
 *      show router          GET         /listings/:id
 *      this router shows individual property's profile .
 */
router.get("/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const list = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", {list});
}));

/**
 * create UPDATE route for listings
 * 
 *      GET     /listings/:id/edit      render a form for edit
 *      PUT     /listings/:id           submit -> render the updated values in show.ejs
 */

// edit route 
router.get("/:id/edit", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

// update route 

router.put("/:id", validateListing, wrapAsync(async (req, res)=> {
    let {id} = req.params;
    console.log(id);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(`Updated Successfully`);
    res.redirect(`/listings`);
}));


// implement DELETE Route           "/listings/:id"

router.delete("/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`------------------------- Deleted Listing -------------------------`)
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports = router;