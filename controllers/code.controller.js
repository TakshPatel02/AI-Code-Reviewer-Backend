import { codeReviewer } from '../services/ai.service.js';

const reviewCode = async (req, res) => {
    try{
        const {code} = req.body;

        if(!code){
            return res.status(400).json({
                success: false,
                message: 'Code is required for review.',
            });
        }

        const review = await codeReviewer(code);

        if(!review){
            return res.status(500).json({
                success: false,
                message: 'Failed to get a review from the AI service.',
            });
        }

        return res.status(200).json({
            success: true,
            review: review
        })

    } catch(err){
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