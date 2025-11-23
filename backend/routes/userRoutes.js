import express from 'express';
import User from '../models/User.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, isAdmin, async (req, res) => {
    console.log('[API/USERS] Маршрут досягнутий.');
    console.log(`[API/USERS] Користувач-запитувач: ${req.user.email} (${req.user.role})`);
    const filter = req.query.role ? { role: req.query.role } : {};
    
    try {
        const users = await User.find(filter).select('-password');
        console.log(`[API/USERS] Знайдено користувачів: ${users.length}`);
        res.json(users);
    } catch (error) {
        console.error('Помилка отримання списку користувачів:', error);
        res.status(500).json({ message: 'Помилка сервера при отриманні користувачів' });
    }
});

export default router;