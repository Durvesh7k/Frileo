import express from 'express';
import { register, login } from '../controllers/authController.js';
import { createGig, getGigs, getGigById, updateGig, deleteGig } from '../controllers/gigController.js';
import { createOrder, updateOrderStatus, getOrders } from '../controllers/orderController.js';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { getUser, updateUser } from '../controllers/userController.js';
import {createCheckoutSession} from '../controllers/paymentController.js'
import verifyJWT from "../middlewares/verifyJWT.js"

const router = express.Router();


router.get('/users/:id', verifyJWT, getUser);

// 🔐 Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// 🎨 Gig Routes
router.post('/gigs', verifyJWT, createGig);
router.get('/gigs', getGigs);
router.get('/gigs/:id', getGigById);
router.put('/gigs/:id', verifyJWT, updateGig);
router.delete('/gigs/:id', verifyJWT, deleteGig);

// 🛒 Order Routes
router.post('/orders', verifyJWT, createOrder);
router.put('/orders/:id/status', verifyJWT, updateOrderStatus);
router.get('/orders/:id', verifyJWT, getOrders);

// ⭐ Review Routes
router.post('/reviews', verifyJWT, createReview);
router.get('/reviews/:gigId', getReviews);

// for payments
router.post('/make-payment', verifyJWT, createCheckoutSession);


// 💬 Message Routes
router.post('/messages', verifyJWT, sendMessage);
router.get('/messages/:conversationId', verifyJWT, getMessages);

router.get("/user/:id", getUser);
router.put("/user/:id", updateUser);

export default router;
