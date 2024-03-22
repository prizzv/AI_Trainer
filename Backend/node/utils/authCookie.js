const jwt = require("jsonwebtoken");

const setAccessTokenCookiesToResponse = (res, user, returnCookie) => {
    const payload = {
        userProfileId: user._id,
        userName: user.name,
        userAuthID: user.authId,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
    });

    if (returnCookie) {
        return accessToken;
    }
};

const setRefreshTokenCookiesToResponse = (res, user, returnCookie) => {
    const payload = {
        userProfileId: user._id,
        userName: user.name,
        userAuthID: user.authId,
    };
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    });

    if (returnCookie) {
        return refreshToken;
    }
};

const setAuthCookies = (res, user, returnCookies) => {
    const accessToken = setAccessTokenCookiesToResponse(
        res,
        user,
        returnCookies ? true : false
    );
    const refreshToken = setRefreshTokenCookiesToResponse(
        res,
        user,
        returnCookies ? true : false
    );

    if (returnCookies) {
        return { accessToken, refreshToken };
    }
};

module.exports = {
    setAccessTokenCookiesToResponse,
    setRefreshTokenCookiesToResponse,
    setAuthCookies,
};
