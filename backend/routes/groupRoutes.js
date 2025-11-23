import express from 'express';
import Group from '../models/Group.js';
import Course from '../models/Course.js';
import { protect, isAdmin, isAdminOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/courses', protect, isAdmin, async (req, res) => {
    const { title, description, pricePerHour } = req.body;

    try {
        const course = new Course({
            title,
            description,
            pricePerHour
        });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: 'Помилка створення курсу.', error: error.message });
    }
});

router.get('/courses', protect, isAdminOrTeacher, async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання курсів.' });
    }
});

router.post('/', protect, isAdmin, async (req, res) => {
    const { name, course, teacher, students, format } = req.body;

    try {
        const group = new Group({
            name,
            course,
            teacher,
            students,
            format,
        });

        const createdGroup = await group.save();
        res.status(201).json(createdGroup);
    } catch (error) {
        res.status(400).json({ message: 'Помилка створення групи.', error: error.message });
    }
});

router.get('/', protect, isAdminOrTeacher, async (req, res) => {
    const userRole = req.user.role;
    let query = {};

    if (userRole === 'teacher') {
        query = { teacher: req.user.id };
    }

    try {
        const groups = await Group.find(query)
            .populate('course', 'title')
            .populate('teacher', 'name email')
            .populate('students', 'name email');

        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера при отриманні груп.' });
    }
});

router.put('/:id', protect, isAdmin, async (req, res) => {
    const { name, course, teacher, students, format, isActive } = req.body;

    try {
        const group = await Group.findById(req.params.id);

        if (group) {
            group.name = name || group.name;
            group.course = course || group.course;
            group.teacher = teacher || group.teacher;
            group.students = students || group.students;
            group.format = format || group.format;
            group.isActive = isActive !== undefined ? isActive : group.isActive;

            const updatedGroup = await group.save();
            res.json(updatedGroup);
        } else {
            res.status(404).json({ message: 'Групу не знайдено.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Помилка оновлення групи.' });
    }
});

export default router;