const UserProfileModel = require("../models/userProfile");
const AuthModel = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
    setAccessTokenCookiesToResponse,
    setAuthCookies,
    setRefreshTokenCookiesToResponse,
} = require("../utils/authCookie");

// create a new user
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const { name, age, height, gender } = req.body;

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
            username,
        });

        //Create the user profile model
        const newUser = new UserProfileModel({
            authId: newUserAuth._id,
            name,
            age,
            height,
            gender,
        });

        const token = setAuthCookies(res, newUserAuth, true);
        console.log({ token });

        await newUserAuth.save();
        await newUser.save();

        res.status(201).json({ data: { newUser, token } });
    } catch (error) {
        res.status(400).json(error);
    }
};

// login a registered user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserProfileModel.findByCredentials(email, password);
        if (!user) {
            return res
                .status(401)
                .send({
                    error: "Login failed! Check authentication credentials",
                });
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
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
