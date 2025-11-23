import React from "react";
import "./components.css";
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
    
    const isAuthenticated = state.user !== null;
    const userRole = isAuthenticated ? state.user.role : 'guest';

    return (
        <header className="PageHeader">
            <ul className="Menu">
                <li className="MenuItem"><NavLink to="/" end className={({ isActive }) => isActive ? "MenuItemLink ActiveLink" : "MenuItemLink"}>Головна</NavLink></li>
                <li className="MenuItem"><NavLink to="/about" end className={({ isActive }) => isActive ? "MenuItemLink ActiveLink" : "MenuItemLink"}>Про нас</NavLink></li>
                <li className="MenuItem"><NavLink to="/reviews" end className={({ isActive }) => isActive ? "MenuItemLink ActiveLink" : "MenuItemLink"}>Відгуки</NavLink></li>
                <li className="MenuItem"><NavLink to="/contacts" end className={({ isActive }) => isActive ? "MenuItemLink ActiveLink" : "MenuItemLink"}>Контакти</NavLink></li>
                {isAuthenticated && (
                    <li className="MenuItem">
                        <NavLink to={`/dashboard/${userRole}`} end>Кабінет ({userRole})</NavLink>
                    </li>
                )}
            </ul>
            <a href="/" className="HeaderLogo"><img src={logo} alt="Logo" className="HeaderLogoImage" /></a>
            <section className="RightSideMenu">
                {isAuthenticated ? (
                    <button onClick={logoutHandler} className="AutorizationButton LogoutButton">
                        Вихід
                    </button>
                ) : (
                    <NavLink to="/authorize" className="AutorizationButton">
                        Авторизація
                    </NavLink>
                )}
                <div className="DecorText"></div>
                <section className="LogoSection">
                    <a href=""><img src={instagramlogo} alt="Instagram" className="LogoImage" /></a>
                    <a href=""><img src={telegramlogo} alt="Telegram" className="LogoImage" /></a>
                </section>
            </section>
        </header>
    )
};

export default Header;