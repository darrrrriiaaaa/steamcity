import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from '../context/AuthContext';

import logo from "../images/logo.jpg";
import instagramlogo from "../images/instagram.png";
import telegramlogo from "../images/telegram.png";

const Header = ({ }) => {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();
    
    const logoutHandler = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };
    
    const getLinkClass = ({ isActive }) => 
        isActive ? "border-b-2 border-accent pb-0.5 font-medium transition-all" : "hover:text-primary transition-colors";

    const isAuthenticated = state.user !== null;
    const userRole = isAuthenticated ? state.user.role : 'guest';

    return (
        <header className="bg-white h-[100px] flex justify-between items-center shadow-md sticky top-0 z-50 px-4">
            <ul className="flex w-2/5 justify-around items-center text-lg">
                <li className="MenuItem"><NavLink to="/" end className={getLinkClass}>Головна</NavLink></li>
                <li className="MenuItem"><NavLink to="/about" end className={getLinkClass}>Про нас</NavLink></li>
                <li className="MenuItem"><NavLink to="/reviews" end className={getLinkClass}>Відгуки</NavLink></li>
                <li className="MenuItem"><NavLink to="/contacts" end className={getLinkClass}>Контакти</NavLink></li>
                {isAuthenticated && (
                    <li className="MenuItem">
                        <NavLink to={`/dashboard/${userRole}`} end className={getLinkClass}>Кабінет ({userRole})</NavLink>
                    </li>
                )}
            </ul>
            <a href="/" className="h-full py-2"><img src={logo} alt="Logo" className="h-full object-contain" /></a>
            <section className="flex w-2/5 justify-evenly items-center">
                {isAuthenticated ? (
                    <button onClick={logoutHandler} className="px-6 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all font-semibold">
                        Вихід
                    </button>
                ) : (
                    <NavLink to="/authorize" className="px-6 py-2 bg-primary text-white rounded-full hover:bg-accent transition-all font-semibold shadow-lg">
                        Авторизація
                    </NavLink>
                )}
                <div className="h-9 w-[1px] bg-black/50"></div>
                <section className="w-1/5 flex justify-around text-2xl text-primary">
                    <a href=""><img src={instagramlogo} alt="Instagram" className="h-8 w-8 object-contain" /></a>
                    <a href=""><img src={telegramlogo} alt="Telegram" className="h-8 w-8 object-contain" /></a>
                </section>
            </section>
        </header>
    )
};

export default Header;