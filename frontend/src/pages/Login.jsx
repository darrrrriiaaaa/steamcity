import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.SERVER_API_URL || 'http://localhost:5000';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post(
                `${API_URL}/api/auth/login`,
                { email, password }
            );

            dispatch({ type: 'LOGIN_SUCCESS', payload: data }); 
            
            const userRole = data.role;
            if (userRole === 'admin') {
                navigate('/dashboard/admin');
            } else if (userRole === 'teacher') {
                navigate('/dashboard/teacher');
            } else {
                navigate('/dashboard/student'); 
            }

        } catch (err) {
            const errorMessage = err.response && err.response.data.message 
                ? err.response.data.message 
                : 'Помилка авторизації. Перевірте з\'єднання.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="LoginPageContainer">
            <h2>Авторизація</h2>
            {error && <p className="ErrorText">{error}</p>}
            {loading && <p>Завантаження...</p>}
            
            <form onSubmit={submitHandler} className="LoginForm">
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Введіть email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <label>Пароль:</label>
                <input
                    type="password"
                    placeholder="Введіть пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Вхід...' : 'Увійти'}
                </button>
            </form>
            <p>
                Немає облікового запису? Зверніться до адміністратора для реєстрації.
            </p>
        </div>
    );
};

export default Login;