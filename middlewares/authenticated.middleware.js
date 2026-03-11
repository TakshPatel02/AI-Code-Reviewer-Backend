import jwt from 'jsonwebtoken';

// The middleware function responsible for verifying the presence and validity of the JWT access token in the request headers. It checks for the token, verifies it, and attaches the decoded user information to the request object for use in subsequent handlers. If the token is missing or invalid, it sends an appropriate error response back to the client.
const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        if(!decoded){
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Authorization denied.'
            });
        }

        req.user = decoded.payload;

        next();

    } catch(err){
        console.error('Error in authentication middleware:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while authenticating the user.'
        })
    }
}

export default isAuthenticated;