const mongoose = require("mongoose");
const { Schema } = mongoose;
const { GenderType } = require("../types/enums");

const userProfileSchema = new Schema({
    authId: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    height: {
        // height is in cm
        type: Number,
    },
    gender: {
        type: String,
        enum: Object.values(GenderType),
    },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
