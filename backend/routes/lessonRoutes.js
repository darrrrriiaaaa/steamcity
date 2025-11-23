import express from 'express';
import Lesson from '../models/Lesson.js';
import Group from '../models/Group.js';
import { protect, isAdmin, isAdminOrTeacher } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    let query = {};
    
    try {
        let groupIds = [];
        if (userRole === 'teacher') {
            const groups = await Group.find({ teacher: userId }).select('_id');
            groupIds = groups.map(group => group._id);
        } else if (userRole === 'student') {
            const groups = await Group.find({ students: userId }).select('_id');
            groupIds = groups.map(group => group._id);
        } else if (userRole === 'admin') {
            query = {}; 
        } else {
            return res.status(403).json({ message: 'Недостатньо прав для перегляду розкладу.' });
        }

        if (userRole !== 'admin') {
            query = { group: { $in: groupIds } };
        }

        const lessons = await Lesson.find(query)
            .populate({
                path: 'group',
                select: 'name format teacher students course',
                populate: [
                    { path: 'teacher', select: 'name' },
                    { path: 'course', select: 'title' },
                    { path: 'students', select: 'name'}
                ]
            })
            .sort('dateTime');

        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера при отриманні розкладу.', error: error.message });
    }
});

router.post('/', protect, isAdminOrTeacher, async (req, res) => {
    const { group, date, time, topic, duration, location } = req.body;

    try {
        const finalDateTime = req.body.dateTime 
            ? req.body.dateTime 
            : new Date(`${date}T${time}`);

        const lesson = new Lesson({
            group,
            dateTime: finalDateTime,
            topic,
            duration,
            location,
        });

        const createdLesson = await lesson.save(); 
        res.status(201).json(createdLesson);
    } catch (error) {
        res.status(400).json({ message: 'Помилка створення заняття.', error: error.message });
    }
});

router.put('/:id', protect, isAdminOrTeacher, async (req, res) => {
    const { dateTime, topic, duration, isCancelled } = req.body;
    
    try {
        const lesson = await Lesson.findById(req.params.id).populate('group', 'teacher');

        if (!lesson) {
            return res.status(404).json({ message: 'Заняття не знайдено.' });
        }
        
        if (req.user.role === 'teacher' && lesson.group.teacher.toString() !== req.user.id.toString()) {
             return res.status(403).json({ message: 'Ви не є викладачем цього заняття.' });
        }

        lesson.dateTime = dateTime || lesson.dateTime;
        lesson.topic = topic || lesson.topic;
        lesson.duration = duration || lesson.duration;
        lesson.isCancelled = isCancelled !== undefined ? isCancelled : lesson.isCancelled;

        const updatedLesson = await lesson.save();
        res.json(updatedLesson);
    } catch (error) {
        res.status(500).json({ message: 'Помилка оновлення заняття.', error: error.message });
    }
});

router.put('/:id/attendance', protect, isAdminOrTeacher, async (req, res) => {
    const { attendanceUpdates } = req.body;

    try {
        const lesson = await Lesson.findById(req.params.id).populate('group', 'teacher');
        
        if (!lesson) {
            return res.status(404).json({ message: 'Заняття не знайдено.' });
        }

        if (req.user.role === 'teacher' && lesson.group.teacher.toString() !== req.user.id.toString()) {
             return res.status(403).json({ message: 'Ви не є викладачем цього заняття.' });
        }

        attendanceUpdates.forEach(update => {
            const index = lesson.attendance.findIndex(att => att.student.toString() === update.studentId);
            if (index !== -1) {
                lesson.attendance[index].status = update.status || lesson.attendance[index].status;
                lesson.attendance[index].notes = update.notes !== undefined ? update.notes : lesson.attendance[index].notes;
                lesson.attendance[index].updatedAt = Date.now();
            }
        });

        const updatedLesson = await lesson.save();
        res.json(updatedLesson);

    } catch (error) {
        res.status(500).json({ message: 'Помилка обліку відвідуваності.', error: error.message });
    }
});

export default router;