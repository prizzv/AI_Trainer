const UserProfileModel = require("../models/userProfile");
const AuthModel = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
    setAccessTokenCookiesToResponse,
    setAuthCookies,
    setRefreshTokenCookiesToResponse,
} = require("../utils/authCookie");

// create a new user
const register = async (req, res) => {
    try {
        const { email, password, userName, name, age, height, gender } = req.body;

        // check if all fields are provided
        if (
            !email ||
            !password ||
            !userName ||
            !name ||
            !age ||
            !height ||
            !gender
        ) {
            return res
                .status(400)
                .json({ success: false, error: "All fields are required" });
        }

        // Verify if the user already exists
        const existingUserAuth = await AuthModel.findOne({ email });
        if (existingUserAuth) {
            return res.status(400).json({ error: "User already exists" });
        }

        //Verify the user password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%&])[A-Za-z\d@$!%&]{8,20}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Password must contain at least one uppercase letter, one lowercase letter, a special character, and a number with atleast 8 characters.",
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(14);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create the auth model of the user
        const newUserAuth = new AuthModel({
            email,
            password: hashedPassword,
            userName,
        });

        //Create the user profile model
        const newUser = new UserProfileModel({
            authId: newUserAuth._id,
            name,
            age,
            height,
            gender,
        });

        const token = setAuthCookies(res, newUser, true);

        newUserAuth.accessToken = token.accessToken;
        newUserAuth.refreshToken = token.refreshToken;

        // await newUserAuth.save();
        // await newUser.save();
        data = newUser._doc;
        data = { ...data, token };

        return res.status(201).json({ data });
    } catch (error) {
        console.log({ error });
        res.status(400).json({ error: error.message });
    }
};

// login a registered user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userAuth = await AuthModel.findByCredentials(email, password);

        if (!userAuth) {
            return res.status(401).json({
                error: "Login failed! Check authentication credentials",
            });
        }
        const user = await UserProfileModel.findOne({ authId: userAuth._id });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const token = setAuthCookies(res, user, true);
        userAuth.accessToken = token.accessToken;
        userAuth.refreshToken = token.refreshToken;
        await userAuth.save();

        const data = { ...user._doc, token };
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log({ error });
        res.status(400).json({ error: error.message });
    }
};

// View logged in user profile
const profile = async (req, res) => {
    res.send(req.user);
};

// Log user out of the application
const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
};

// forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserProfileModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: "User not found" });
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = { register, login, profile, logout, forgotPassword };
