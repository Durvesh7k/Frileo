import Stripe from 'stripe';
import prisma from '../utils/prisma.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { gig: true },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
            price_data: {
                currency: 'usd',
                unit_amount: Math.round(order.gig.price * 100),
                product_data: {
                    name: order.gig.title,
                    description: order.gig.description,
                },
            },
            quantity: 1,
        }],
        metadata: {
            gigId: order.gig.id,
            buyerId: order.buyerId,
            sellerId: order.sellerId,
            orderId: order.id,
        },
        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    await prisma.payment.create({
        data: {
            amount: order.gig.price,
            status: 'PENDING',
            orderId: order.id,
            transactionId: session.id,
        }
    });

    res.json({ url: session.url });
};
