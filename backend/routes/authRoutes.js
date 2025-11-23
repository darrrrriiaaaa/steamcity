import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const getAuthData = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    };
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(`[LOGIN ATTEMPT] Email: ${email}`);

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        console.log(`Користувача ${email} не знайдено.`);
        res.json(getAuthData(user));
    }
    if (await user.matchPassword(password)) {
        console.log('Вхід здійснено успішно!');
        res.json(getAuthData(user));
    } else {
        console.log('Паролі не співпали.');
        res.status(401).json({ message: 'Невірний Email або пароль.' });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'Користувач з таким Email вже існує.' });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        if (user) {
            res.status(201).json(getAuthData(user));
        }
    } catch (error) {
        res.status(400).json({ message: 'Невірні дані користувача', error: error.message });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Користувача не знайдено.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера.' });
    }
});

export default router;