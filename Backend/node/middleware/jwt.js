const jwt = require("jsonwebtoken");
const { merge } = require("lodash");

const AuthModel = require("../models/auth");
const UserProfileModel = require("../models/userProfile");

const { setAccessTokenCookiesToResponse } = require("../utils/authCookie");

const TryCatch = require("../providers/TryCatch");
const { CustomError } = require("../config/custom-error");
const { AUTH_ERRORS, COMMON_ERRORS } = require("../messages/errors");

const verifyRefreshToken = async (refreshToken, next) => {
    return new Promise(async (resolve, reject) => {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const userAuth = await AuthModel.findById(decoded.user_id);

        if (!userAuth) {
            next(new CustomError(AUTH_ERRORS.LOGIN_EXPIRED, 401));
        } else {
            resolve(userAuth);
        }
    });
};

const protect = (allowedRoutes = ["Regular"]) =>
    TryCatch(async (req, res, next) => {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken === undefined) {
            return res
                .status(401)
                .json({ success: false, error: COMMON_ERRORS.UNAUTHORIZED });
        }

        try {
            if (accessToken) {
                const decoded = await jwt.verify(
                    accessToken,
                    process.env.JWT_ACCESS_SECRET
                );

                const userAuth = await AuthModel.findById(decoded.user_id);

                if (!userAuth) {
                    return res.status(400).json({
                        success: false,
                        error: AUTH_ERRORS.LOGIN_EXPIRED,
                    });
                }

                const userProfile = await UserProfileModel.findById(
                    userAuth.profileId
                );

                merge(req, {
                    intercept: {
                        auth: userAuth,
                        profile: userProfile,
                    },
                });

                // Check user's access against the allowed routes
                if (Array.isArray(userAuth.accessRoles)) {
                    if (allowedRoutes.includes("Regular")) return next();

                    const hasAccess = userAuth.accessRoles.some((role) =>
                        allowedRoutes.includes(role)
                    );

                    if (!hasAccess) {
                        return res
                            .status(403)
                            .json({
                                success: false,
                                error: COMMON_ERRORS.FORBIDDEN,
                            });
                    }
                } else {
                    return res
                        .status(403)
                        .json({
                            success: false,
                            error: COMMON_ERRORS.FORBIDDEN,
                        });
                }

                return next();
            } else {
                const userAuth = await verifyRefreshToken(refreshToken, next);

                setAccessTokenCookiesToResponse(res, userAuth._id.toString());

                const userProfile = await UserProfileModel.findById(
                    userAuth.profileId
                );

                merge(req, {
                    intercept: {
                        auth: userAuth,
                        profile: userProfile,
                    },
                });

                // Check user's access against the allowed routes
                if (Array.isArray(userAuth.accessRoles)) {
                    if (allowedRoutes.includes("Regular")) return next();

                    const hasAccess = userAuth.accessRoles.some((role) =>
                        allowedRoutes.includes(role)
                    );

                    if (!hasAccess) {
                        return res
                            .status(403)
                            .json({
                                success: false,
                                error: COMMON_ERRORS.FORBIDDEN,
                            });
                    }
                } else {
                    return res
                        .status(403)
                        .json({
                            success: false,
                            error: COMMON_ERRORS.FORBIDDEN,
                        });
                }

                return next();
            }
        } catch (error) {
            // If the access token is invalid or has expired, clear the cookies
            console.error("JWT Error :: ", error);

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res
                .status(401)
                .json({ success: false, error: COMMON_ERRORS.UNAUTHORIZED });
        }
    });

const isAuthenticated = TryCatch(async (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken === undefined) {
        return res
            .status(401)
            .json({ success: false, error: COMMON_ERRORS.UNAUTHORIZED });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
        const userAuth = await verifyRefreshToken(refreshToken, next);

        if (!userAuth?.profileId) {
            return res
                .status(401)
                .json({ success: false, error: COMMON_ERRORS.UNAUTHORIZED });
        }

        merge(req, {
            intercept: {
                auth: userAuth,
            },
        });

        next();
    } catch (error) {
        return next(new CustomError(COMMON_ERRORS.UNAUTHORIZED, 401));
    }
});

module.exports = protect;
