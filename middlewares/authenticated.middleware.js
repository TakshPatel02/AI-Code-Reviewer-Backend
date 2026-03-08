import jwt from 'jsonwebtoken';

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