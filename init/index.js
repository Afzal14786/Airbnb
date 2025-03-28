const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbPath = "mongodb://127.0.0.1:27017/airbnb";


main().then(()=> {
    console.log("Connection Successfully . . .");
}).catch((err)=> {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbPath);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialise . . .");
}

initDB();