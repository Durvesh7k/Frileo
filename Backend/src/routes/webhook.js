// routes/webhook.js
import express from 'express';
import Stripe from 'stripe';
import prisma from '../utils/prisma.js'


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// NOTE: No /webhook here, just root-level POST
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('✅ Webhook received:', event.type);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const paymentIntentId = session.payment_intent;
        const orderId = session.metadata.orderId;


        console.log(paymentIntentId);
        console.log(orderId)

        if (paymentIntentId) {
            await prisma.payment.update({
                where: { orderId: orderId },
                data: { status: 'SUCCESS', transactionId: paymentIntentId},
            });

            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'IN_PROGRESS'},
            });
        }
    }

    res.status(200).json({ received: true });
});

export default router;
