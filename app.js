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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);


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
// ---------------------------------------------------------------------------------------

app.get("/", (req, res)=> {
    res.send("Server is running fine . . .");
});

/**
 *      index route             GET         /listings
 */
app.get("/listings", wrapAsync(async (req, res)=> {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));


/**
 * create route for new listings
 * 
 *      GET             /listings/new           render the form
 *      POST            /listing                submit button and insert all details into DB 
 */

app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

app.post("/listings", wrapAsync(async (req, res, next)=> {  
    if (!req.body.listing) {
        throw new customErr(400, "Please Send Valid Data For Listing");
    }
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

/**
 *      show route          GET         /listings/:id
 *      this route shows individual property's profile .
 */
app.get("/listings/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("./listings/show.ejs", {list});
}));



/**
 * create UPDATE route for listings
 * 
 *      GET     /listings/:id/edit      render a form for edit
 *      PUT     /listings/:id           submit -> render the updated values in show.ejs
 */

// edit route 
app.get("/listings/:id/edit",  wrapAsync(async (req, res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

// update route 

app.put("/listings/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings`);
}));


// implement DELETE Route           "/listings/:id"

app.delete("/listings/:id", wrapAsync(async (req, res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));























// app.get("/listing", async (req, res)=> {
//     let sampleListing = new Listing({
//         title : "My New Home",
//         description : "Welcome to my new home",
//         price : 7000,
//         location : "Kopar Khairane Navi Mumbai 400709",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved . . .");
//     res.send("Added to listing successfully . . .");
// });


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