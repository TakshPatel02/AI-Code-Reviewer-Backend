import jwt from 'jsonwebtoken';

// The utility functions responsible for generating JWT access and refresh tokens. These functions take a payload (user information) and sign it using the respective secret keys defined in the environment variables, with specified expiration times for each token type.
const generateAccessToken = (payload) => {
    return jwt.sign({
        payload
    }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
    });
}

// The utility function responsible for generating a JWT refresh token. It takes a payload (user information) and signs it using the refresh token secret key defined in the environment variables, with a longer expiration time compared to the access token.
const generateRefreshToken = (payload) => {
    return jwt.sign({
        payload
    }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
}

export {
    generateAccessToken,
    generateRefreshToken
}