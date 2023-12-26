// Create jwtToken And Save Into a Cookie
const jwtToken = (user, statusCode, res) => {
    // Generate jwtToken
    const jwtToken = user.generateJWTToken();
    // Creating Options For a Cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRY_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    // Saving jwtToken into a Cookie
    res.status(statusCode).cookie('jwtToken', jwtToken, options).json({
        success: true,
        user,
        jwtToken
    });
}

module.exports = { jwtToken }