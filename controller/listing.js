const Listing = require("../models/listing");

/**
 * Implementing Index Route
 */

module.exports.index = async (req, res)=> {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.newListing =  (req, res) => {
    // if(!req.isAuthenticated()) {
    //     req.flash("error", "You must be logged in for new post");
    //     return res.redirect("/listings");
    // }
    res.render("./listings/new.ejs");
}

module.exports.postNewListing = async (req, res, next)=> {  
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(`Listing Added Successfully . . . `);
    req.flash("success", "New Listing Created Successfully");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res)=> {
    let {id} = req.params;
    const list = await Listing.findById(id).populate({path : "reviews", populate : {
        path : "author"
    }}).populate("owner");
    if (!list) {
        req.flash("error", "The listing you are trying to access, does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {list});
}

module.exports.editListing = async (req, res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "The listing you are trying to access, does not exist");
    }
    res.render("./listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req, res)=> {
    let {id} = req.params;
   
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`------------------------- Deleted Listing -------------------------`);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}