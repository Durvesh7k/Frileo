import Stripe from 'stripe';
import prisma from '../utils/prisma.js'; // assuming wrapped export

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
    try {
        const { gigId, buyerId, sellerId } = req.body;

        // Get gig price
        const gig = await prisma.gig.findUnique({ where: { id: gigId } });

        if (!gig) return res.status(404).json({ message: 'Gig not found' });

        const order = await prisma.order.create({
            data: {
                gigId,
                buyerId,
                sellerId,
                status: 'PENDING'
            }
        });

        res.status(201).json({
            orderId: order.id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updated = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        res.json({ message: 'Order status updated', updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update order' });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { id } = req.params;

        const orders = await prisma.order.findMany({
            where: {
                OR: [{ buyerId: id }, { sellerId: id }],
            },
            include: {
                gig: true,
                payment: true,
            },
        });

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};