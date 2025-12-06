import React from "react";
import { NavLink } from "react-router-dom";
import bgImage from '../images/room2.jpg';

const Main = () => {
    return (
        <div className="relative w-full h-screen lg:h-[85vh] bg-cover bg-no-repeat bg-[center_30%]" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="bg-white/90 backdrop-blur-sm shadow-2xl flex flex-col items-center justify-center text-center w-[90%] py-10 px-6 rounded-3xl
            lg:absolute lg:right-0 lg:top-1/4 lg:bottom-auto lg:w-3/5 lg:h-1/2 lg:py-0 lg:px-10 lg:rounded-l-[300px] lg:rounded-r-none lg:bg-white/80">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
                    Репетиторський центр <br className="hidden sm:block" /> STEAM City
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-lg text-center px-2">
                    Сучасна освіта для майбутнього!
                </p>
                <NavLink to="/about" className="mt-6 lg:mt-8 px-8 py-3 bg-primary text-white text-lg lg:text-xl rounded-full hover:bg-opacity-90 hover:scale-105 transition-all shadow-lg inline-block">
                    Дізнатись більше
                </NavLink>
            </div>
        </div>
    )
};

export default Main;