const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');

const createPayment = asyncHandler(async (req, res) => {
    const { student, course, amountPaid, paymentMethod, paymentDate, isConfirmed } = req.body;

    if (!student || !course || !amountPaid) {
        res.status(400);
        throw new Error('Будь ласка, заповніть усі обов’язкові поля (студент, курс, сума).');
    }

    const payment = new Payment({
        student,
        course,
        amountPaid,
        paymentMethod,
        paymentDate: paymentDate || Date.now(),
        isConfirmed: isConfirmed || false,
    });

    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
});

const getPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.find({})
        .populate('student', 'name email')
        .populate('course', 'title');
    
    res.json(payments);
});

module.exports = {
    createPayment,
    getPayments,
};