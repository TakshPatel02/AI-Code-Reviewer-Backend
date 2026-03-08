import jwt from 'jsonwebtoken';

const generateAccessToken = (payload) => {
    return jwt.sign({
        payload
    }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
    });
}

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