import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/authorize');
        }
    }, [user, navigate]);

    const fetchUsers = async () => {
        if (user && user.role === 'admin') {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get('http://localhost:5000/api/users', config); 
                
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
                'http://localhost:5000/api/auth/register',
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


    if (loading) return <h2>Завантаження користувачів...</h2>;
    if (error) return <h2 className='ErrorText'>Помилка: {error}</h2>;
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="UsersScreenContainer">
            <h2>Управління користувачами</h2>

            <div className="CreationFormSection">
                <h3>Створити нового користувача</h3>
                {creationStatus && (
                    <p className={creationStatus.type === 'error' ? 'ErrorText' : 'SuccessText'}>
                        {creationStatus.message}
                    </p>
                )}
                <form onSubmit={createUserHandler} className="UserForm">
                    <input type="text" placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Студент</option>
                        <option value="teacher">Викладач</option>
                        <option value="admin">Адміністратор</option>
                    </select>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
                    <button type="submit">Створити</button>
                </form>
            </div>
            
            <h3>Список усіх користувачів</h3>
            <table className="UsersTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ім'я</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Статус</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u._id.substring(18)}...</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.isActive ? 'Активний' : 'Заблокований'}</td>
                            <td>
                                {u._id !== user._id && (
                                    <button 
                                        onClick={() => deleteUserHandler(u._id)} 
                                        className="DeleteButton"
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
    );
};

export default UsersScreen;