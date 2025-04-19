const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = Schema({
    email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = Model("User", userSchema);