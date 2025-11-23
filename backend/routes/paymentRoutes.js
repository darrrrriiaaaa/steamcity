import express from 'express';
import Payment from '../models/Payment.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const payments = await Payment.find({})
            .populate('student', 'name email')
            .populate('course', 'title');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання оплат' });
    }
});

router.post('/', protect, isAdmin, async (req, res) => {
    const { student, course, amountPaid, paymentMethod } = req.body;
    try {
        const payment = new Payment({
            student,
            course,
            amountPaid,
            paymentMethod
        });
        const createdPayment = await payment.save();
        res.status(201).json(createdPayment);
    } catch (error) {
        res.status(400).json({ message: 'Помилка створення оплати', error: error.message });
    }
});

export default router;