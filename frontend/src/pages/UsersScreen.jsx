import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('12345');
    const [role, setRole] = useState('student');
    const [creationStatus, setCreationStatus] = useState(null);

    const { state } = useAuth();
    const navigate = useNavigate();
    const { user } = state;

    console.log("Поточний користувач:", user);

    const fetchUsers = async () => {
        if (user && user.role === 'admin') {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get(`${API_URL}/api/users`, config); 
                
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError('Помилка завантаження користувачів.');
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user]);

    const createUserHandler = async (e) => {
        e.preventDefault();
        setCreationStatus(null);
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            
            await axios.post(
                `${API_URL}/api/auth/register`,
                { name, email, password, role },
                config
            );
            
            setCreationStatus({ type: 'success', message: `Користувач ${email} (${role}) успішно створений!` });
            
            fetchUsers();

            setName('');
            setEmail('');
            setRole('student');
            
        } catch (err) {
            const msg = err.response && err.response.data.message 
                ? err.response.data.message 
                : 'Помилка створення користувача.';
            setCreationStatus({ type: 'error', message: msg });
        }
    };

    const deleteUserHandler = (id) => {
        alert(`Видалення користувача ID: ${id}.`);
    };

    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition duration-200";

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    if (loading) return <div className="text-center mt-20 text-2xl text-primary font-bold">Завантаження користувачів...</div>;
    if (error) return <div className="text-center mt-20 text-2xl text-red-500 font-bold">{error}</div>;
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

    return (
        <div className="min-h-[85vh] bg-gray-50 p-4 md:p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-primary pl-4">Управління користувачами</h2>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                    Створити нового користувача
                </h3>
                {creationStatus && (
                    <p className={`mb-6 p-4 rounded-lg border ${creationStatus.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {creationStatus.message}
                    </p>
                )}
                <form onSubmit={createUserHandler} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                    <input type="text" placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass}/>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass}/>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
                        <option value="student">Учень</option>
                        <option value="teacher">Викладач</option>
                        <option value="admin">Адміністратор</option>
                    </select>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required className={inputClass}/>
                    <button type="submit" className='w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition duration-300 transform hover:scale-105 shadow-md h-[50px]'>Створити</button>
                </form>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-700">Список усіх користувачів ({users.length})</h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary text-gray-700 uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Ім'я</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Роль</th>
                                <th className="p-4 font-semibold">Статус</th>
                                <th className="p-4 font-semibold text-right">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-purple-50 transition duration-150">
                                    <td className="p-4 text-gray-500 font-mono text-xs">{u._id.substring(18)}...</td>
                                    <td className="p-4 font-medium text-gray-900">{u.name}</td>
                                    <td className="p-4 text-gray-600">{u.email}</td>
                                    
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(u.role)}`}>
                                            {u.role === 'student' ? 'Учень' : u.role === 'teacher' ? 'Викладач' : 'Адмін'}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className={`flex items-center gap-2 ${u.isActive ? 'text-green-600' : 'text-red-500'} font-medium text-sm`}>
                                            <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {u.isActive ? 'Активний' : 'Блок'}
                                        </span>
                                    </td>
                                    
                                    <td className="p-4 text-right">
                                        {u._id !== user._id && (
                                            <button 
                                                onClick={() => deleteUserHandler(u._id)} 
                                                className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors 
                                                    ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}
                                                    ${u.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={u.role === 'admin'}
                                            >
                                                {u.isActive ? 'Блокувати' : 'Активувати'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersScreen;