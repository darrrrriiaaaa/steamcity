import React from "react";
import { NavLink } from "react-router-dom";
import bgImage from '../images/room2.jpg';

const Main = ({ }) => {
    return (
        <div className="h-[85vh] w-full bg-cover bg-[center_40%] relative" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="absolute right-0 top-1/3 w-3/5 h-1/2 bg-white/80 backdrop-blur-sm rounded-l-[300px] flex flex-col items-center justify-center shadow-2xl p-10">
                    <h1 className="text-5xl font-bold text-primary mb-4">Репетиторський центр STEAM City</h1>
                    <p className="text-xl text-gray-700 max-w-lg text-center">Сучасна освіта для майбутнього!</p>
                    <NavLink to="/about" className="mt-8 px-8 py-3 bg-primary text-white text-xl rounded-full hover:bg-accent hover:scale-105 transition-all shadow-lg inline-block">
                        Дізнатись більше
                    </NavLink>
            </div>
        </div>
    )
};

export default Main;