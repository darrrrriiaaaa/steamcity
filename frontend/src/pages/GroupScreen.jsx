import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
    
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/authorize');
        }
    }, [user, navigate]);

    const fetchData = async () => {
        if (!user || user.role !== 'admin') return;

        setLoading(true);
        setError(null);

        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
        };

        try {
            const coursesRes = await axios.get('http://localhost:5000/api/groups/courses', config);
            setCourses(coursesRes.data);

            const groupsRes = await axios.get('http://localhost:5000/api/groups', config);
            setGroups(groupsRes.data);

            const teachersRes = await axios.get('http://localhost:5000/api/users?role=teacher', config);
            setTeachers(teachersRes.data);

            const studentsRes = await axios.get('http://localhost:5000/api/users?role=student', config);
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
                'http://localhost:5000/api/groups/courses',
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
             return setFormError('Заповніть усі поля та додайте хоча б одного студента.');
        }
        
        try {
            const config = {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            };
            
            await axios.post(
                'http://localhost:5000/api/groups',
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


    return (
        <div className="GroupScreenContainer">
            <h2>Керування Курсами та Групами</h2>
            {formError && <p className='ErrorText'>{formError}</p>}
            
            <section className="CourseCreation">
                <h3>Створити Новий Курс</h3>
                <form onSubmit={createCourseHandler}>
                    <input 
                        type="text" 
                        placeholder="Назва курсу (напр., Python Basic)" 
                        value={newCourseTitle} 
                        onChange={(e) => setNewCourseTitle(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Ціна за годину" 
                        value={newCoursePrice} 
                        onChange={(e) => setNewCoursePrice(e.target.value)} 
                        required 
                    />
                    <button type="submit">Створити Курс</button>
                </form>
            </section>
            
            <section className="GroupCreation">
                <h3>Створити Нову Групу</h3>
                <form onSubmit={createGroupHandler}>
                    <input 
                        type="text" 
                        placeholder="Назва Групи (напр., Python-01-A)" 
                        value={newGroupName} 
                        onChange={(e) => setNewGroupName(e.target.value)} 
                        required 
                    />
                    
                    <label>Курс:</label>
                    <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
                        {courses.map((c) => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                    
                    <label>Викладач:</label>
                    <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} required>
                        <option value="">-- Виберіть викладача --</option>
                        {teachers.map((t) => (
                            <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                        ))}
                    </select>

                    <h4>Вибір студентів (всього: {students.length})</h4>
                    <div className="StudentSelectionGrid">
                        {students.map((s) => (
                            <div key={s._id}>
                                <input
                                    type="checkbox"
                                    id={s._id}
                                    checked={selectedStudents.includes(s._id)}
                                    onChange={() => toggleStudentSelection(s._id)}
                                />
                                <label htmlFor={s._id}>{s.name}</label>
                            </div>
                        ))}
                    </div>

                    <button type="submit">Створити Групу</button>
                </form>
            </section>
            
            <section className="GroupList">
                <h3>Активні Групи ({groups.length})</h3>
                <table className="GroupsTable">
                    <thead>
                        <tr>
                            <th>Група</th>
                            <th>Курс</th>
                            <th>Викладач</th>
                            <th>Студентів</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((g) => (
                            <tr key={g._id}>
                                <td>{g.name}</td>
                                <td>{g.course ? g.course.title : 'N/A'}</td>
                                <td>{g.teacher ? g.teacher.name : 'N/A'}</td>
                                <td>{g.students.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default GroupScreen;