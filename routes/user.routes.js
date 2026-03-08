import express from 'express';
import { deleteReviewById, getAllReviews, getReviewById} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/authenticated.middleware.js';

const router = express.Router();

router.get('/reviews', isAuthenticated, getAllReviews);

router.get('/reviews/:id', isAuthenticated, getReviewById);

router.delete('/reviews/:id', isAuthenticated, deleteReviewById);

export default router;