import prisma from "../utils/prisma.js"

// CREATE GIG
export const createGig = async (req, res) => {
    const { title, description, price, category, imageUrl, deliveryTime} = req.body;
    const userId = req.user?.id; // requires verifyJWT middleware

    try {
        const gig = await prisma.gig.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                category,
                imageUrl,
                userId,
                deliveryTime,
            },
        });

        res.status(201).json(gig);
    } catch (err) {
        console.error('Create gig error:', err);
        res.status(500).json({ error: 'Failed to create gig' });
    }
};

// GET ALL GIGS
export const getGigs = async (req, res) => {
    try {
        const gigs = await prisma.gig.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        res.status(200).json(gigs);
    } catch (err) {
        console.error('Fetch gigs error:', err);
        res.status(500).json({ error: 'Failed to fetch gigs' });
    }
};

// GET SINGLE GIG BY ID
export const getGigById = async (req, res) => {
    const { id } = req.params;

    try {
        const gig = await prisma.gig.findUnique({
            where: { id: id },
            include: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!gig) return res.status(404).json({ error: 'Gig not found' });

        res.status(200).json(gig);
    } catch (err) {
        console.error('Get gig by ID error:', err);
        res.status(500).json({ error: 'Failed to fetch gig' });
    }
};

// UPDATE GIG
export const updateGig = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, price, category, imageUrl } = req.body;

    try {
        const gig = await prisma.gig.findUnique({ where: { id: id } });

        if (!gig || gig.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized or gig not found' });
        }

        const updatedGig = await prisma.gig.update({
            where: { id: parseInt(id) },
            data: { title, description, price: parseFloat(price), category, imageUrl },
        });

        res.status(200).json(updatedGig);
    } catch (err) {
        console.error('Update gig error:', err);
        res.status(500).json({ error: 'Failed to update gig' });
    }
};

// DELETE GIG
export const deleteGig = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const gig = await prisma.gig.findUnique({ where: { id: id } });

        if (!gig || gig.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized or gig not found' });
        }

        await prisma.gig.delete({ where: { id: parseInt(id) } });

        res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (err) {
        console.error('Delete gig error:', err);
        res.status(500).json({ error: 'Failed to delete gig' });
    }
};
