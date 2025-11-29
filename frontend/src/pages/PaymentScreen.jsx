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

    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200 mb-4";
    const labelClass = "block text-gray-700 text-sm font-bold mb-2";
    const cardClass = "bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full";

    return (
        <div className="min-h-[85vh] bg-gray-50 p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-primary pl-4">Управління оплатами</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className={cardClass}>
                    <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">Додати оплату</h3>
                    {creationStatus && (
                        <p className={creationStatus.type === 'error' ? 'ErrorText' : 'SuccessText'}>
                            {creationStatus.message}
                        </p>
                    )}
                    <form onSubmit={createPaymentHandler}>
                        
                        <label className={labelClass}>Учень:</label>
                        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required className={inputClass}>
                            <option value="">Оберіть учня</option>
                            {students.map((s) => (
                                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                            ))}
                        </select>

                        <label className={labelClass}>Курс (із записаних):</label>
                        <select 
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)} 
                            required 
                            disabled={!selectedStudent}
                            className={inputClass}
                        >
                            <option value="">-- Оберіть курс --</option>
                            {availableCourses.length === 0 && selectedStudent && <option disabled>Учень не записаний на жоден курс</option>}
                            {availableCourses.map((c) => (
                                <option key={c._id} value={c._id}>{c.title} ({c.pricePerHour} грн/зан)</option>
                            ))}
                        </select>

                        <label className={labelClass}>Сума, грн:</label>
                        <input 
                            type="number" 
                            placeholder="Сума" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            required
                            className={inputClass}
                        />

                        <label className={labelClass}>Метод:</label>
                        <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputClass}>
                            <option value="Transfer">Банківський переказ</option>
                            <option value="Card">Картка</option>
                            <option value="Cash">Готівка</option>
                        </select>

                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-md mt-2">Зберегти Оплату</button>
                    </form>
                </div>

                {selectedStudent && selectedCourse && (
                    <div className={cardClass}>
                        <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">Інформація по курсу</h3>
                        <div className="flex flex-col h-full">
                            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                                <p>Ціна за заняття: {studentUnpaidLessons[0]?.price} грн</p>
                                <p>Пройдено занять: {studentUnpaidLessons.length}</p>
                                <hr />
                                <p>Нараховано: {stats.totalCost} грн</p>
                                <p>Сплачено всього: {stats.totalPaid} грн</p>
                                <p className={`flex justify-between items-center p-4 rounded-lg border-2 ${stats.balance < 0 ? 'bg-red-200 border-red-200' : 'bg-green-200 border-green-200'}`}>
                                    {stats.balance < 0 ? `Борг: ${stats.balance} грн` : `Баланс: +${stats.balance} грн`}
                                </p>
                            </div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Список пройдених занять:</h4>
                            <ul className="space-y-2">
                                {studentUnpaidLessons.map(lesson => (
                                    <li key={lesson._id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center text-sm border border-gray-100">
                                        {new Date(lesson.dateTime).toLocaleDateString()} — {lesson.topic || 'Без теми'}
                                    </li>
                                ))}
                                {studentUnpaidLessons.length === 0 && <li className="text-gray-400 text-center py-4 italic">Занять ще не було</li>}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            
            <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <h3 className="text-lg font-bold text-gray-700">Історія всіх транзакцій</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary text-gray-700 uppercase text-xs tracking-wider">
                            <th className="p-4 font-semibold">Дата</th>
                            <th className="p-4 font-semibold">Учень</th>
                            <th className="p-4 font-semibold">Курс</th>
                            <th className="p-4 font-semibold">Сума</th>
                            <th className="p-4 font-semibold">Метод</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payments.map((p) => (
                            <tr key={p._id} className="hover:bg-purple-50 transition duration-150">
                                <td className="p-4 text-gray-600 text-sm">{new Date(p.paymentDate).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-gray-800">{p.student ? p.student.name : 'Видалений'}</td>
                                <td className="p-4 font-bold text-gray-800">{p.course ? p.course.title : 'Видалений'}</td>
                                <td className="p-4 font-bold text-gray-800">{p.amountPaid} грн</td>
                                <td className="p-4 font-bold text-gray-800">{p.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default PaymentsScreen;