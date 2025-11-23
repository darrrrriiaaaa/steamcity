import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API works');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/schedule', lessonRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.statusCode(statusCode);
    res.json({message: err.message});
});

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    () => console.log(`Server running on port ${PORT}`)
);