import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { state } = useAuth();
    const navigate = useNavigate();
    
    console.log("Поточний користувач:", state.user);

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
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Доступ заборонено</h2>
                    <p className="text-gray-600 mb-6">
                        Ця сторінка доступна лише адміністраторам. <br/>
                        Ваша роль: <span className="font-bold text-primary">{state.user ? state.user.role : 'Гість'}</span>
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
            <div className="mb-10 text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-primary mb-3">
                    Адміністративна Панель
                </h2>
                <p className="text-xl text-gray-600">
                    Вітаємо, <span className="font-semibold text-black">{state.user.name}</span>!
                </p>
            </div>
            
            <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-accent">Управління Системою</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">  
                    <Link to="/admin/users" className="group bg-white p-5 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl md:text-4xl bg-secondary p-3 md:p-4 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                    👥
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">Користувачі</h4>
                                <p className="text-gray-500 mt-1">Створення, блокування та редагування</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/groups" className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl md:text-4xl bg-secondary p-3 md:p-4 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                📚
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">Курси та групи</h4>
                                <p className="text-gray-500 mt-1">Формування груп та навчальних програм</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/admin/payments" className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl md:text-4xl bg-secondary p-3 md:p-4 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                💰
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">Фінанси</h4>
                                <p className="text-gray-500 mt-1">Облік оплат та фінансова звітність</p>
                            </div>
                        </div>
                    </Link>
                    <Link to="/schedule" className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl md:text-4xl bg-secondary p-3 md:p-4 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                📅
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">Загальний розклад</h4>
                                <p className="text-gray-500 mt-1">Календар занять усіх груп</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;