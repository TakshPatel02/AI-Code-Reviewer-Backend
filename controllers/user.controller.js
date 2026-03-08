import Code from '../models/code.model.js';

const getAllReviews = async (req, res) => {
    try {
        const user = req.user;

        console.log('User from token:', user);
        console.log('Looking for reviews with userId:', user.id);

        const reviews = await Code.find({ userId: user.id });

        console.log('Reviews found:', reviews.length);

        return res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: reviews
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getReviewById = async (req, res) => {
    try {
        const user = req.user;
        const reviewId = req.params.id;

        const review = await Code.findOne({ _id: reviewId, userId: user.id });

        if(!review){
            return res.status(404).json({
                success: false,
                message: 'This review does not exist or does not belong to the user.'
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review retrieved successfully",
            data: review
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const deleteReviewById = async (req, res) => {
    try{
        const user = req.user;
        const reviewId = req.params.id;

        const review = await Code.findOneAndDelete({_id: reviewId, userId: user.id});

        if(!review){
            return res.status(404).json({
                success: false,
                message: 'This review does not exist or does not belong to the user.'
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        })

    } catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export {
    getAllReviews,
    getReviewById,
    deleteReviewById
}