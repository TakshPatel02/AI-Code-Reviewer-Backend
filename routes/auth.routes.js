import express from 'express';
import { loginUser, signupUser, logoutUser, newRefreshTokenGeneration } from '../controllers/auth.controller.js';
import isAuthenticated from '../middlewares/authenticated.middleware.js';

const router = express.Router();

router.post('/signup', signupUser);

router.post('/login', loginUser);

router.patch('/logout', isAuthenticated ,logoutUser);

router.get('/protected', isAuthenticated, (req, res) => {
    const user = req.user;

    return res.status(200).json({
        success: true,
        message: 'You have accessed a protected route.',
        data: user
    });
});

router.get('/refresh-token', newRefreshTokenGeneration);

export default router;