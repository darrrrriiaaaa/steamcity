import express from 'express';
import Material from '../models/Material.js';
import Submission from '../models/Submission.js';
import Lesson from '../models/Lesson.js';
import { protect, isAdminOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdminOrTeacher, async (req, res) => {
    const { title, lesson, type, content, dueDate } = req.body;
    
    try {
        const lessonData = await Lesson.findById(lesson).populate({
            path: 'group',
            select: 'teacher'
        });

        if (!lessonData || lessonData.group.teacher.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Ви не є викладачем цього заняття, щоб додавати матеріали.' });
        }

        const material = new Material({
            title,
            lesson,
            type,
            content,
            dueDate,
            teacher: req.user.id,
        });

        const createdMaterial = await material.save();
        res.status(201).json(createdMaterial);
    } catch (error) {
        res.status(400).json({ message: 'Помилка створення матеріалу/завдання.', error: error.message });
    }
});

router.get('/lesson/:lessonId', protect, async (req, res) => {
    const lessonId = req.params.lessonId;
    
    try {
        const materials = await Material.find({ lesson: lessonId }).sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера при отриманні матеріалів.' });
    }
});

router.post('/submit/:assignmentId', protect, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Тільки учні можуть здавати завдання.' });
    }
    
    const assignmentId = req.params.assignmentId;
    const { submissionURL } = req.body;

    try {
        const assignment = await Material.findById(assignmentId);
        if (!assignment || assignment.type !== 'assignment') {
            return res.status(404).json({ message: 'Завдання не знайдено або це не завдання.' });
        }
        
        const submission = new Submission({
            assignment: assignmentId,
            student: req.user.id,
            submissionURL,
        });

        const createdSubmission = await submission.save();
        res.status(201).json(createdSubmission);

    } catch (error) {
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'Ви вже здали це завдання.' });
        }
        res.status(500).json({ message: 'Помилка здачі завдання.', error: error.message });
    }
});

router.put('/grade/:submissionId', protect, isAdminOrTeacher, async (req, res) => {
    const { grade, feedback } = req.body;

    try {
        const submission = await Submission.findById(req.params.submissionId).populate({
            path: 'assignment',
            populate: { path: 'lesson', populate: { path: 'group', select: 'teacher' } }
        });

        if (!submission) {
            return res.status(404).json({ message: 'Виконану роботу не знайдено.' });
        }
        
        const teacherId = submission.assignment.lesson.group.teacher.toString();
        if (req.user.id.toString() !== teacherId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Ви не є викладачем цього завдання.' });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.isGraded = true;

        const updatedSubmission = await submission.save();
        res.json(updatedSubmission);

    } catch (error) {
        res.status(500).json({ message: 'Помилка оцінювання роботи.', error: error.message });
    }
});

export default router;