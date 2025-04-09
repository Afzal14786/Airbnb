const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),            // title is required
        description : Joi.string().required(),      // description is required
        image : Joi.string().allow("", null),       // image can be empty or null
        price : Joi.number().required().min(0),     // price is required and not < 0
        location : Joi.string().required(),         // location is required
        country : Joi.string().required()           // country is required
    }).required()
});

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required(),
        comment : Joi.string().required()
        
    }).required()
});

module.exports = reviewSchema;
module.exports = listingSchema;