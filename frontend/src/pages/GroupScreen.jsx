import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const GroupScreen = () => {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formError, setFormError] = useState(null);

    const { state } = useAuth();
    const navigate = useNavigate();
    const { user } = state;

    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCoursePrice, setNewCoursePrice] = useState(0);

    const [newGroupName, setNewGroupName] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    
    console.log("Поточний користувач:", user);
    
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/authorize');
        }
    }, [user, navigate]);

    const fetchData = async () => {
        if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Доступ заборонено</h2>
                    <p className="text-gray-600 mb-6">
                        Ця сторінка доступна лише адміністраторам. <br/>
                        Ваша роль: <span className="font-bold text-primary">{user ? user.role : 'Гість'}</span>
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition shadow-md"
                    >
                        Повернутися на головну
                    </button>
                </div>
            </div>
        );
        };

        setLoading(true);
        setError(null);

        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };

        try {
            const coursesRes = await axios.get(`${API_URL}/api/groups/courses`, config);
            setCourses(coursesRes.data);

            const groupsRes = await axios.get(`${API_URL}/api/groups`, config);
            setGroups(groupsRes.data);

            const teachersRes = await axios.get(`${API_URL}/api/users?role=teacher`, config);
            setTeachers(teachersRes.data);

            const studentsRes = await axios.get(`${API_URL}/api/users?role=student`, config);
            setStudents(studentsRes.data);
            
            if (coursesRes.data.length > 0) {
                setSelectedCourseId(coursesRes.data[0]._id);
            }

            setLoading(false);
        } catch (err) {
            setError('Помилка завантаження даних для управління групами.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);
    
    const createCourseHandler = async (e) => {
        e.preventDefault();
        setFormError(null);
        if (!newCourseTitle || newCoursePrice <= 0) {
            return setFormError('Заповніть назву та ціну курсу.');
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.post(
                `${API_URL}/api/groups/courses`,
                { 
                    title: newCourseTitle, 
                    description: `Автоматично створений курс ${newCourseTitle}`,
                    pricePerHour: newCoursePrice
                },
                config
            );

            setNewCourseTitle('');
            setNewCoursePrice(0);
            fetchData();
        } catch (err) {
            setFormError('Помилка створення курсу.');
        }
    };
    
    const createGroupHandler = async (e) => {
        e.preventDefault();
        setFormError(null);
        if (!newGroupName || !selectedCourseId || !selectedTeacherId || selectedStudents.length === 0) {
             return setFormError('Заповніть усі поля та додайте хоча б одного учня.');
        }
        
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            };
            
            await axios.post(
                `${API_URL}/api/groups`,
                { 
                    name: newGroupName, 
                    course: selectedCourseId,
                    teacher: selectedTeacherId,
                    students: selectedStudents
                },
                config
            );
            
            setNewGroupName('');
            setSelectedStudents([]);
            fetchData();
        } catch (err) {
            setFormError('Помилка створення групи.');
        }
    };

    if (loading) return <h2>Завантаження...</h2>;
    if (error) return <h2 className='ErrorText'>Помилка: {error}</h2>;
    
    const toggleStudentSelection = (studentId) => {
        setSelectedStudents((prev) => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200 mb-4";
    const labelClass = "block text-gray-700 text-sm font-bold mb-2";
    const cardClass = "bg-white rounded-2xl shadow-lg p-8 border border-gray-100";

    return (
        <div className="min-h-[85vh] bg-gray-50 p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-primary pl-4">Керування курсами та групами</h2>
            {formError && <p className='ErrorText'>{formError}</p>}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <section className={cardClass}>
                    <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">Створити Новий Курс</h3>
                    <form onSubmit={createCourseHandler}>
                        <label className={labelClass}>Назва курсу </label>
                        <input 
                            type="text" 
                            placeholder="Python Basic" 
                            value={newCourseTitle} 
                            onChange={(e) => setNewCourseTitle(e.target.value)} 
                            required
                            className={inputClass}
                        />
                        <label className={labelClass}>Ціна за заняття, грн</label>
                        <input 
                            type="number"
                            value={newCoursePrice} 
                            onChange={(e) => setNewCoursePrice(e.target.value)} 
                            required
                            className={inputClass}
                        />
                        <button type="submit" className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-primary transition duration-300 shadow-md mt-2">Створити Курс</button>
                    </form>
                </section>
            
                <section className={`${cardClass} lg:col-span-2`}>
                    <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">Створити нову групу</h3>
                    <form onSubmit={createGroupHandler}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={labelClass}>Назва групи</label>
                            <input
                                type="text"
                                value={newGroupName} 
                                onChange={(e) => setNewGroupName(e.target.value)} 
                                required
                                className={inputClass}
                            />                    
                            <label className={labelClass}>Курс:</label>
                            <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required className={inputClass}>
                                {courses.map((c) => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                            <label className={labelClass}>Викладач:</label>
                            <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} required className={inputClass}>
                                <option value="">Виберіть викладача</option>
                                {teachers.map((t) => (
                                    <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                                ))}
                            </select>
                            <label className={`${labelClass} mt-4`}>Вибір учнів (всього: {students.length})</label>
                            <div className="border border-gray-200 rounded-lg p-4 h-48 overflow-y-auto mb-6 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {students.map((s) => (
                                    <div key={s._id} onClick={() => toggleStudentSelection(s._id)}
                                        className={`cursor-pointer p-2 rounded-md border text-sm flex items-center transition-all duration-200
                                            ${selectedStudents.includes(s._id) ? 'bg-secondary border-primary text-primary font-medium shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-accent'}`}>
                                        <div className={`w-4 h-4 rounded-full mr-2 flex-shrink-0 border 
                                            ${selectedStudents.includes(s._id) ? 'bg-primary border-primary' : 'bg-white border-gray-400'}`} />
                                        {s.name}
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-md">Створити Групу</button>
                        </div>
                    </form>
                </section>
            </div>
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <h3 className="text-lg font-bold text-gray-700">Активні групи ({groups.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary text-gray-700 uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold">Група</th>
                                <th className="p-4 font-semibold">Курс</th>
                                <th className="p-4 font-semibold">Викладач</th>
                                <th className="p-4 font-semibold">Учні</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {groups.map((g) => (
                                <tr key={g._id} className="hover:bg-purple-50 transition duration-150">
                                    <td className="p-4 text-gray-800">{g.name}</td>
                                    <td className="p-4 text-gray-800">{g.course ? g.course.title : 'N/A'}</td>
                                    <td className="p-4 text-gray-800">{g.teacher ? g.teacher.name : 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {g.students && g.students.length > 0 ? (
                                                g.students.map(s => (
                                                    <p key={s._id} className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap">{s.name}</p>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 text-xs italic">Немає учнів</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default GroupScreen;