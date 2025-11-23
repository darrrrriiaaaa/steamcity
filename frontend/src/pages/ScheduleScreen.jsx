import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ScheduleScreen = () => {
    const [groups, setGroups] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);
    
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('1h00m');
    const [format, setFormat] = useState('Онлайн');

    const { state } = useAuth();
    const navigate = useNavigate();
    const { user } = state;
    
    const userRole = user ? user.role : 'guest';

    const fetchData = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };

        try {
            if (userRole === 'admin') {
                const groupsRes = await axios.get('http://localhost:5000/api/groups', config);
                setGroups(groupsRes.data);
                if (groupsRes.data.length > 0) {
                    setSelectedGroupId(groupsRes.data[0]._id);
                }
            }
            
            const scheduleRes = await axios.get('http://localhost:5000/api/schedule', config);
            setSchedule(scheduleRes.data);

            setLoading(false);
        } catch (err) {
            setError('Помилка завантаження даних розкладу.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/authorize');
        } else {
            fetchData();
        }
    }, [user, navigate]);

    const createLessonHandler = async (e) => {
        e.preventDefault();
        setFormError(null);
        if (!selectedGroupId || !date || !startTime) {
            return setFormError('Заповніть усі необхідні поля.');
        }

        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            };
            
            await axios.post(
                'http://localhost:5000/api/schedule',
                { 
                    group: selectedGroupId,
                    date: date,
                    time: startTime,
                    duration: duration,
                    format: format
                },
                config
            );
            
            setFormError({ type: 'success', message: `Заняття успішно додано до розкладу!` });
            
            fetchData();
            
        } catch (err) {
            const msg = err.response && err.response.data.message 
                ? err.response.data.message 
                : 'Помилка створення заняття.';
            setFormError({ type: 'error', message: msg });
        }
    };

    const getScheduleTitle = () => {
        switch (userRole) {
            case 'admin':
                return 'Загальний розклад усіх занять';
            case 'teacher':
                return `Мій розклад занять, викладач ${user.name}`;
            case 'student':
                return `Мій розклад занять, студент ${user.name}`;
            default:
                return 'Розклад';
        }
    }

    if (loading) return <h2>Завантаження розкладу...</h2>;
    if (error) return <h2 className='ErrorText'>Помилка: {error}</h2>;
    if (!user) return null;

    return (
        <div className="ScheduleScreenContainer">
            <h2>{getScheduleTitle()}</h2>
            
            {userRole === 'admin' && (
                <section className="LessonCreation">
                    <h3>Створити нове заняття</h3>
                    {formError && (
                        <p className={formError.type === 'error' ? 'ErrorText' : 'SuccessText'}>
                            {formError.message}
                        </p>
                    )}
                    <form onSubmit={createLessonHandler}>
                        <label>Група:</label>
                        <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)} required>
                            {groups.map((g) => (
                                <option key={g._id} value={g._id}>{g.name} ({g.course.title})</option>
                            ))}
                        </select>
                        
                        <label>Дата:</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                        
                        <label>Час початку:</label>
                        <input 
                            type="time" 
                            value={startTime} 
                            onChange={(e) => setStartTime(e.target.value)} 
                            required 
                        />

                        <label>Тривалість:</label>
                        <input 
                            type="text" 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)} 
                        />

                        <label>Формат:</label>
                        <select value={format} onChange={(e) => setFormat(e.target.value)}>
                            <option value="Онлайн">Онлайн</option>
                            <option value="Офлайн">Офлайн</option>
                        </select>
                        
                        <button type="submit">Створити заняття</button>
                    </form>
                </section>
            )}

            <section className="ScheduleList">
                <h3>Актуальні заняття ({schedule.length})</h3>
                <table className="ScheduleTable">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Час</th>
                            <th>Тривалість</th>
                            <th>Група</th>
                            <th>Учні</th>
                            {userRole !== 'teacher' && <th>Викладач</th>}
                            <th>Курс</th>
                            <th>Формат</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((lesson) => (
                            <tr key={lesson._id}>
                                <td>{new Date(lesson.dateTime).toLocaleDateString('uk-UA')}</td>
                                <td>{new Date(lesson.dateTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{lesson.duration}</td>
                                <td>{lesson.group.name}</td>
                                <td>
                                    {lesson.group.students && lesson.group.students.length > 0 
                                        ? lesson.group.students.map(s => s.name).join(', ') 
                                        : 'Немає студентів'}
                                </td>
                                {userRole !== 'teacher' && <td>{lesson.group.teacher.name}</td>}
                                <td>{lesson.group.course.title}</td>
                                <td>{lesson.format}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {schedule.length === 0 && <p>На жаль, занять поки немає.</p>}
            </section>
        </div>
    );
};

export default ScheduleScreen;