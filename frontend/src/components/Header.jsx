import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

import logo from "../images/logo.jpg";
import instagramlogo from "../images/instagram.png";
import telegramlogo from "../images/telegram.png";

const Header = () => {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setIsMenuOpen(false);
    };
    
    const closeMenu = () => setIsMenuOpen(false);

    const getLinkClass = ({ isActive }) => 
        isActive 
            ? "border-b-2 border-accent pb-0.5 font-medium transition-all text-primary" 
            : "hover:text-primary transition-colors text-gray-700";

    const isAuthenticated = state.user !== null;
    const userRole = isAuthenticated ? state.user.role : 'guest';

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="h-[80px] md:h-[100px] flex justify-between items-center px-4 max-w-7xl mx-auto">
                <a href="/" className="h-full py-2 flex items-center md:hidden">
                    <img src={logo} alt="Logo" className="h-4/5 object-contain" />
                </a>

                <ul className="hidden md:flex w-2/5 justify-around items-center text-lg">
                    <li><NavLink to="/" end className={getLinkClass}>Головна</NavLink></li>
                    <li><NavLink to="/about" end className={getLinkClass}>Про нас</NavLink></li>
                    <li><NavLink to="/reviews" end className={getLinkClass}>Відгуки</NavLink></li>
                    <li><NavLink to="/contacts" end className={getLinkClass}>Контакти</NavLink></li>
                    {isAuthenticated && (
                        <li>
                            <NavLink to={`/dashboard/${userRole}`} end className={getLinkClass}>Кабінет ({userRole})</NavLink>
                        </li>
                    )}
                </ul>

                <a href="/" className="hidden md:block h-full py-2">
                    <img src={logo} alt="Logo" className="h-full object-contain" />
                </a>
                
                <section className="hidden md:flex w-2/5 justify-evenly items-center">
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
                        <a href=""><img src={instagramlogo} alt="Instagram" className="h-8 w-8 object-contain hover:scale-110 transition-transform" /></a>
                        <a href=""><img src={telegramlogo} alt="Telegram" className="h-8 w-8 object-contain hover:scale-110 transition-transform" /></a>
                    </section>
                </section>

                <button 
                    className="md:hidden text-primary focus:outline-none" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg flex flex-col items-center py-4 space-y-4">
                    <NavLink to="/" onClick={closeMenu} className={getLinkClass}>Головна</NavLink>
                    <NavLink to="/about" onClick={closeMenu} className={getLinkClass}>Про нас</NavLink>
                    <NavLink to="/reviews" onClick={closeMenu} className={getLinkClass}>Відгуки</NavLink>
                    <NavLink to="/contacts" onClick={closeMenu} className={getLinkClass}>Контакти</NavLink>
                    
                    {isAuthenticated && (
                        <NavLink to={`/dashboard/${userRole}`} onClick={closeMenu} className={getLinkClass}>
                            Кабінет ({userRole})
                        </NavLink>
                    )}

                    <hr className="w-1/2 border-gray-200" />

                    <div className="flex space-x-6">
                        <a href=""><img src={instagramlogo} alt="Inst" className="h-8 w-8" /></a>
                        <a href=""><img src={telegramlogo} alt="Tg" className="h-8 w-8" /></a>
                    </div>

                    {isAuthenticated ? (
                        <button onClick={logoutHandler} className="px-8 py-2 border-2 border-primary text-primary rounded-full w-3/4">
                            Вихід
                        </button>
                    ) : (
                        <NavLink to="/authorize" onClick={closeMenu} className="px-8 py-2 bg-primary text-white rounded-full w-3/4 text-center">
                            Авторизація
                        </NavLink>
                    )}
                </div>
            )}
        </header>
    )
};

export default Header;