const jwt = require("jsonwebtoken");
const { merge } = require("lodash");

const AuthModel = require("../models/auth");
const UserProfileModel = require("../models/userProfile");

const { setAccessTokenCookiesToResponse } = require("../utils/authCookie");

const { ExpressError } = require("../utils/ExpressError");

const verifyRefreshToken = async (refreshToken, next) => {
    return new Promise(async (resolve, reject) => {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const userAuth = await AuthModel.findById(decoded.userAuthId);

        const userProfile = await UserProfileModel.findById(
            decoded.userProfileId
        );

        if (!userAuth) {
            next(new ExpressError("Login Expired please Login again", 401));
        } else {
            resolve({ userAuth, userProfile });
        }
    });
};

const verifyAccessToken = async (accessToken, next) => {
    return new Promise(async (resolve, reject) => {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        const userAuth = await AuthModel.findById(decoded.userAuthId);

        const userProfile = await UserProfileModel.findById(
            decoded.userProfileId
        );

        if (!userAuth) {
            next(new ExpressError("Login Expired please Login again", 401));
        } else {
            resolve({ userAuth, userProfile });
        }
    });
};

const protect = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken === undefined) {
        return res
            .status(401)
            .json({ success: false, error: "JWT Token not provided" });
    }

    try {
        if (accessToken) {
            console.log("Executing in access token block");
            userData = await verifyAccessToken(accessToken, next);

            merge(req, {
                intercept: {
                    auth: userData.userAuth,
                    profile: userData.userProfile,
                },
            });

            return next();
        } else {
            console.log("Executing in refresh token block");
            const userData = await verifyRefreshToken(refreshToken, next);

            setAccessTokenCookiesToResponse(res, userData.userProfile, true);

            merge(req, {
                intercept: {
                    auth: userData.userAuth,
                    profile: userData.userProfile,
                },
            });

            return next();
        }
    } catch (error) {
        // If the access token is invalid or has expired, clear the cookies
        console.error("JWT Error :: ", error);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
};

const isAuthenticated = async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken === undefined) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    try {
        const userAuth = await verifyRefreshToken(refreshToken, next);
        //TODO: ERROR HERE
        if (!userAuth?.fa) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorized" });
        }

        merge(req, {
            intercept: {
                auth: userAuth,
            },
        });

        next();
    } catch (error) {
        return next(new ExpressError("Unauthorized", 401));
    }
};

module.exports = { protect, isAuthenticated };
