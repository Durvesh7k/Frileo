import prisma from "../utils/prisma.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content } = req.body;

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message', message: err.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const { withUserId } = req.query;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: withUserId },
                    { senderId: withUserId, receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get messages', message: err.message });
    }
};
