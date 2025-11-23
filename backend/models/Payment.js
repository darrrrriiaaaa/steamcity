// backend/models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course'
        },
        amountPaid: {
            type: Number,
            required: true
        },
        paymentDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'Transfer'
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;