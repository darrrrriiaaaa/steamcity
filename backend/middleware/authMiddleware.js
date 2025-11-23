import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = { id: decoded.id, role: decoded.role };

            next();
        } catch (error) {
            res.status(401).json({ message: 'Не авторизовано, токен недійсний.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Не авторизовано, немає токена.' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Доступ заборонено. Потрібні права адміністратора.' });
    }
};

export const isAdminOrTeacher = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'teacher')) {
        next();
    } else {
        res.status(403).json({ message: 'Доступ заборонено. Потрібні права адміністратора або викладача.' });
    }
};