const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const authSchema = new Schema({
    userName: {
        type: String,
        required: true,
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

authSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await Auth.findOne({ email });
        if (!user) {
            throw new Error({ error: "Invalid login credentials" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error({ error: "Invalid login credentials" });
        }
        return user;
    } catch (error) {
        console.log({ error });
        return false;
    }
};

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
