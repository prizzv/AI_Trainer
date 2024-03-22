const mongoose = require("mongoose");
const { Schema } = mongoose;

const authSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
    },
});

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
