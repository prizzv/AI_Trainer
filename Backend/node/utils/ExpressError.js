class ExpressError extends Error {
    constructor(errorMessage, statusCode) {
        super();
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;
        console.log(message + ". code: " + statusCode);
    }
}

module.exports = ExpressError;
