const mongoose = require("mongoose");
const DBURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/rental_platform";

const connectDB = async () => {
    try {
        await mongoose.connect(DBURL, {
            dbName: "rental_platform"
        });
        console.log(`Database connected successfully`);
    } catch (err) {
        console.log(`Error while connecting the DB: ${err}`);
        process.exit(1);
    }
};

module.exports = connectDB;