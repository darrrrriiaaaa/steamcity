import React from 'react';

import entryImage from '../images/entry1.jpg';
import mapImage from '../images/map.png';

const About = () => {
    return (
        <div className="bg-white min-h-screen pb-10">
            <div className="bg-primary py-6 mb-8 shadow-md">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Як нас знайти?
                    </h2>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="bg-secondary/30 rounded-[30px] p-6 md:p-12 shadow-sm relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div className="order-2 lg:order-1">
                            <img src={entryImage} alt="Вхід до центру" className="w-full h-auto object-cover rounded-[40px] shadow-xl border-4 border-white transform -rotate-1 hover:rotate-0 transition-all duration-500"/>
                        </div>
                        <div className="order-1 lg:order-2 flex flex-col">                           
                            <div className="space-y-6 text-lg text-gray-800 mb-8">
                                <div>
                                    <p className="mb-2">Ми знаходимося за адресою м. Запоріжжя,</p>
                                    <p className="font-semibold">вул. Левка Лук'яненка, 27 / вул. Олександрівська, 29</p>
                                </div>
                                <p>
                                    Номер телефону: <a href="tel:+380688821260" className="font-semibold hover:text-primary transition-colors">+380 (68) 882 12 60</a>
                                </p>
                                <div className="space-y-2">
                                    <p>Інстаграм: <a href="https://instagram.com/steamcityzp" target="_blank" rel="noreferrer" className="font-medium hover:text-primary transition-colors">@steamcityzp</a></p>
                                    <p>Телеграм: <a href="https://t.me/steamcityzp" target="_blank" rel="noreferrer" className="font-medium hover:text-primary transition-colors">@steamcityzp</a></p>
                                    <p>Tik tok: <span className="font-medium">@steamcityzp</span></p>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white w-[70%]">
                                <img src={mapImage} alt="Карта" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;