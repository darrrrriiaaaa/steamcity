import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
                const groupsRes = await axios.get(`${API_URL}/api/groups`, config);
                setGroups(groupsRes.data);
                if (groupsRes.data.length > 0) {
                    setSelectedGroupId(groupsRes.data[0]._id);
                }
            }
            
            const scheduleRes = await axios.get(`${API_URL}/api/schedule`, config);
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
                `${API_URL}/api/schedule`,
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
                return `Мій розклад занять, учень ${user.name}`;
            default:
                return 'Розклад';
        }
    }

    if (loading) return <h2>Завантаження розкладу...</h2>;
    if (error) return <h2 className='ErrorText'>Помилка: {error}</h2>;
    if (!user) return null;

    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200";
    const labelClass = "block text-gray-700 text-sm font-bold mb-2";

    return (
        <div className="min-h-[85vh] bg-gray-50 p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-primary pl-4">{getScheduleTitle()}</h2>
            
            {userRole === 'admin' && (
                <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-10">
                    <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">Створити нове заняття</h3>
                    {formError && (
                        <p className={formError.type === 'error' ? 'ErrorText' : 'SuccessText'}>
                            {formError.message}
                        </p>
                    )}
                    <form onSubmit={createLessonHandler}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <section>
                            <label className={labelClass}>Група:</label>
                            <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)} required className={inputClass}>
                                {groups.map((g) => (
                                    <option key={g._id} value={g._id}>{g.name} ({g.course.title})</option>
                                ))}
                            </select>
                            </section>
                            <section>
                            <label className={labelClass}>Дата:</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required className={inputClass}
                            />
                            </section>
                            <section>
                            <label className={labelClass}>Час початку:</label>
                            <input 
                                type="time" 
                                value={startTime} 
                                onChange={(e) => setStartTime(e.target.value)} 
                                required className={inputClass}
                            />
                            </section>
                            <section>
                            <label className={labelClass}>Тривалість:</label>
                            <input 
                                type="text" 
                                value={duration} 
                                onChange={(e) => setDuration(e.target.value)} className={inputClass}
                            />
                            </section>
                            <section>
                            <label className={labelClass}>Формат:</label>
                            <select value={format} onChange={(e) => setFormat(e.target.value)} className={inputClass}>
                                <option value="Онлайн">Онлайн</option>
                                <option value="Офлайн">Офлайн</option>
                            </select>
                            </section>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-md mb-4 h-[50px]">Створити заняття</button>
                        </div>
                    </form>
                </section>
            )}

            <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <h3 className="text-lg font-bold text-gray-700">Актуальні заняття ({schedule.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary text-gray-700 uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold">Дата</th>
                                <th className="p-4 font-semibold">Час</th>
                                <th className="p-4 font-semibold">Тривалість</th>
                                <th className="p-4 font-semibold">Група</th>
                                <th className="p-4 font-semibold">Учні</th>
                                {userRole !== 'teacher' && <th>Викладач</th>}
                                <th className="p-4 font-semibold">Курс</th>
                                <th className="p-4 font-semibold">Формат</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {schedule.map((lesson) => (
                                <tr key={lesson._id} className="hover:bg-purple-50 transition duration-150">
                                    <td className="p-4">{new Date(lesson.dateTime).toLocaleDateString('uk-UA')}</td>
                                    <td className="p-4">{new Date(lesson.dateTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="p-4">{lesson.duration}</td>
                                    <td className="p-4">{lesson.group.name}</td>
                                    <td className="p-4">
                                        {lesson.group.students && lesson.group.students.length > 0 
                                            ? lesson.group.students.map(s => s.name).join(', ') 
                                            : 'Немає учнів'}
                                    </td>
                                    {userRole !== 'teacher' && <td>{lesson.group.teacher.name}</td>}
                                    <td className="p-4">{lesson.group.course.title}</td>
                                    <td >{lesson.format}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {schedule.length === 0 && <p>На жаль, занять поки немає.</p>}
                </div>
            </section>
        </div>
    );
};

export default ScheduleScreen;