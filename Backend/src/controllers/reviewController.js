import prisma from "../utils/prisma.js";

export const createReview = async (req, res) => {
    try {
        const { rating, comment, gigId } = req.body;
        const userId = req.user.id;

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                userId,
                gigId,
            },
        });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create review', message: err.message });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { gigId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { gigId },
            include: {
                user: {
                    select: { id: true, name: true, profilePic: true },
                },
            },
        });

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews', message: err.message });
    }
};
