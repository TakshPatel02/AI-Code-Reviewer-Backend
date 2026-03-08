import express from 'express';
import { reviewCode } from '../controllers/code.controller.js';
import isAuthenticated from '../middlewares/authenticated.middleware.js';

const router = express.Router();

router.post('/review', isAuthenticated, reviewCode);

export default router;