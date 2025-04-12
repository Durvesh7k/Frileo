import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                profilePic: true,
                skills: true,
                role: true,
                gigs: true,
                reviews: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user', message: err.message });
    }
};
