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
    initData.data = initData.data.map((obj)=> ({...obj, owner : "68038404346631b08eecb0dd"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialise . . .");
}

initDB();