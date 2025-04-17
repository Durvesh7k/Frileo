import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'; // Make sure to install this
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// 🔐 Get user from JWT token
export const getLoggedInUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
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
        res.status(401).json({ error: 'Invalid token', message: err.message });
    }
};

// 📄 Get user by ID
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

// ✏️ Update user by ID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, bio, profilePic, skills, role } = req.body;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(bio && { bio }),
                ...(profilePic && { profilePic }),
                ...(skills && { skills }),
                ...(role && { role }),
            },
        });

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user', message: err.message });
    }
};
