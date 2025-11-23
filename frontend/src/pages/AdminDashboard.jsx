import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { state } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!state.user) {
            navigate('/authorize');
        } 
        else if (state.user.role !== 'admin') {
            alert('Доступ заборонено! Ви не адміністратор.');
            navigate(`/dashboard/${state.user.role}`); 
        }
    }, [state.user, navigate]);

    if (!state.user || state.user.role !== 'admin') {
        return null;
    }

    return (
        <div className="DashboardContainer">
            <h2>Адміністративна Панель STEAM City</h2>
            <p>Вітаємо, {state.user.name} ({state.user.email})!</p>
            
            <section className="AdminModules">
                <h3>Управління Системою</h3>
                <ul>
                    <li><a href="/admin/users">Адміністрування користувачів</a></li>
                    <li><a href="/admin/groups">Керування курсами та групами</a></li>
                    <li><a href="/admin/payments">Облік оплат та фінансова звітність</a></li>
                    <li><a href="/schedule">Загальний розклад</a></li>
                </ul>
            </section>
        </div>
    );
};

export default AdminDashboard;