import Code from '../models/code.model.js';

// Importing the codeReviewer function from the AI service, which will be used to get reviews for the submitted code.
const getAllReviews = async (req, res) => {
    try {
        const user = req.user;

        const reviews = await Code.find({ userId: user.id });

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

// The function responsible for retrieving a specific code review by its ID. It checks if the review exists and belongs to the user, and then returns the review details in the response.
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

// The function responsible for deleting a specific code review by its ID. It checks if the review exists and belongs to the user, deletes it from the database, and returns the appropriate response.
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