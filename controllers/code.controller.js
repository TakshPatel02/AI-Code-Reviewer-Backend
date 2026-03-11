import Code from '../models/code.model.js';
import { codeReviewer } from '../services/ai.service.js';

// The main function to review code using the AI model. It takes code as input and send the code to the AI service for review. It also handles user review limits and saves the review results in the db.
const reviewCode = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Code is required for review.',
            });
        }

        const userReviewCount = await Code.countDocuments({ userId: req.user.id });

        if (userReviewCount >= 5) {
            return res.status(400).json({
                success: false,
                message: 'You have reached the maximum limit of 5 reviews per account. Please delete some reviews to create new ones.'
            });
        }

        const review = await codeReviewer(code);

        if (!review) {
            return res.status(500).json({
                success: false,
                message: 'Failed to get a review from the AI service.',
            });
        }

        const formattedReview = review.trim();

        const savedCode = await Code.create({
            userId: req.user.id,
            code: code,
            review: formattedReview
        });

        return res.status(200).json({
            success: true,
            review: review
        })

    } catch (err) {
        console.error('Error reviewing code:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while reviewing the code.',
        })
    }
}

export {
    reviewCode
}