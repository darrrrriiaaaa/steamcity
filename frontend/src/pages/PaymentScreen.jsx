import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentsScreen = () => {
    const [payments, setPayments] = useState([]);
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [schedule, setSchedule] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('Transfer');
    const [creationStatus, setCreationStatus] = useState(null);

    const [availableCourses, setAvailableCourses] = useState([]);
    const [studentUnpaidLessons, setStudentUnpaidLessons] = useState([]);

    const { state } = useAuth();
    const navigate = useNavigate();
    const { user } = state;

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/authorize');
        }
    }, [user, navigate]);

    const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
    };

    const fetchAllData = async () => {
        if (!user || user.role !== 'admin') return;

        try {
            setLoading(true);
            setError(null);

            const [payRes, studRes, groupRes, schedRes] = await Promise.all([
                axios.get('http://localhost:5000/api/payments', config),
                axios.get('http://localhost:5000/api/users?role=student', config),
                axios.get('http://localhost:5000/api/groups', config),
                axios.get('http://localhost:5000/api/schedule', config)
            ]);

            setPayments(payRes.data);
            setStudents(studRes.data);
            setGroups(groupRes.data);
            setSchedule(schedRes.data);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Помилка завантаження даних.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [user]);

    useEffect(() => {
        if (selectedStudent) {
            const studentGroups = groups.filter(g => 
                g.students.some(s => s._id === selectedStudent || s === selectedStudent)
            );
            
            const courses = studentGroups.map(g => g.course);
            const uniqueCourses = [...new Map(courses.map(c => [c['_id'], c])).values()];
            
            setAvailableCourses(uniqueCourses);
            setSelectedCourse('');
        } else {
            setAvailableCourses([]);
        }
    }, [selectedStudent, groups]);

    useEffect(() => {
        if (selectedStudent && selectedCourse) {
            const targetGroup = groups.find(g => 
                g.course._id === selectedCourse && 
                g.students.some(s => s._id === selectedStudent || s === selectedStudent)
            );

            if (targetGroup) {
                const pastLessons = schedule.filter(l => 
                    l.group._id === targetGroup._id && 
                    new Date(l.dateTime) <= new Date()
                );

                const price = targetGroup.course.pricePerHour || 0;

                setStudentUnpaidLessons(pastLessons.map(l => ({
                    ...l,
                    price: price
                })));
            }
        } else {
            setStudentUnpaidLessons([]);
        }
    }, [selectedCourse, selectedStudent, groups, schedule]);

    const createPaymentHandler = async (e) => {
        e.preventDefault();
        setCreationStatus(null);
        if (!selectedStudent || !selectedCourse || !amount) {
            setCreationStatus({ type: 'error', message: 'Заповніть усі поля.' });
            return;
        }

        try {
            await axios.post(
                'http://localhost:5000/api/payments',
                { 
                    student: selectedStudent, 
                    course: selectedCourse, 
                    amountPaid: Number(amount),
                    paymentMethod: method 
                },
                { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } }
            );
            
            setCreationStatus({ type: 'success', message: 'Оплата успішно додана!' });
            fetchAllData();
            setAmount('');
            
        } catch (err) {
            setCreationStatus({ type: 'error', message: 'Помилка створення оплати.' });
        }
    };

    const calculateBalance = () => {
        if (!selectedStudent || !selectedCourse) return null;
        
        const totalPaid = payments
            .filter(p => p.student._id === selectedStudent && p.course._id === selectedCourse)
            .reduce((acc, curr) => acc + curr.amountPaid, 0);

        const totalCost = studentUnpaidLessons.reduce((acc, curr) => acc + (curr.price || 0), 0);

        const balance = totalPaid - totalCost;

        return { totalPaid, totalCost, balance };
    };

    const stats = calculateBalance();

    if (!user || user.role !== 'admin') return null;
    if (loading) return <h2>Завантаження...</h2>;
    if (error) return <h2 className='ErrorText'>{error}</h2>;

    return (
        <div className="PaymentsScreenContainer">
            <h2>Управління оплатами</h2>

            <div className="PaymentLayout" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                
                <div className="CreationFormSection" style={{ flex: 1, minWidth: '300px' }}>
                    <h3>Додати оплату</h3>
                    {creationStatus && (
                        <p className={creationStatus.type === 'error' ? 'ErrorText' : 'SuccessText'}>
                            {creationStatus.message}
                        </p>
                    )}
                    <form onSubmit={createPaymentHandler} className="PaymentForm">
                        
                        <label>Студент:</label>
                        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                            <option value="">-- Оберіть студента --</option>
                            {students.map((s) => (
                                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                            ))}
                        </select>

                        <label>Курс (із записаних):</label>
                        <select 
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)} 
                            required 
                            disabled={!selectedStudent}
                        >
                            <option value="">-- Оберіть курс --</option>
                            {availableCourses.length === 0 && selectedStudent && <option disabled>Студент не записаний на жоден курс</option>}
                            {availableCourses.map((c) => (
                                <option key={c._id} value={c._id}>{c.title} ({c.pricePerHour} грн/зан)</option>
                            ))}
                        </select>

                        <label>Сума (UAH):</label>
                        <input 
                            type="number" 
                            placeholder="Сума" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required 
                        />

                        <label>Метод:</label>
                        <select value={method} onChange={(e) => setMethod(e.target.value)}>
                            <option value="Transfer">Банківський переказ</option>
                            <option value="Card">Картка</option>
                            <option value="Cash">Готівка</option>
                        </select>

                        <button type="submit">Зберегти Оплату</button>
                    </form>
                </div>

                {selectedStudent && selectedCourse && (
                    <div className="DebtInfoSection" style={{ flex: 1, minWidth: '300px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                        <h3>Інформація по курсу</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <p><strong>Ціна за заняття:</strong> {studentUnpaidLessons[0]?.price} грн</p>
                            <p><strong>Пройдено занять:</strong> {studentUnpaidLessons.length}</p>
                            <hr />
                            <p>Нараховано: <strong>{stats.totalCost} грн</strong></p>
                            <p>Сплачено всього: <strong>{stats.totalPaid} грн</strong></p>
                            <p style={{ color: stats.balance < 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                                {stats.balance < 0 ? `Борг: ${stats.balance} грн` : `Баланс: +${stats.balance} грн`}
                            </p>
                        </div>

                        <h4>Список пройдених занять:</h4>
                        <ul style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '0.9rem' }}>
                            {studentUnpaidLessons.map(lesson => (
                                <li key={lesson._id}>
                                    {new Date(lesson.dateTime).toLocaleDateString()} — {lesson.topic || 'Без теми'}
                                </li>
                            ))}
                            {studentUnpaidLessons.length === 0 && <li>Занять ще не було</li>}
                        </ul>
                    </div>
                )}
            </div>
            
            <h3>Історія всіх транзакцій</h3>
            <table className="PaymentsTable">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Студент</th>
                        <th>Курс</th>
                        <th>Сума</th>
                        <th>Метод</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((p) => (
                        <tr key={p._id}>
                            <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                            <td>{p.student ? p.student.name : 'Видалений'}</td>
                            <td>{p.course ? p.course.title : 'Видалений'}</td>
                            <td>{p.amountPaid} грн</td>
                            <td>{p.paymentMethod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentsScreen;