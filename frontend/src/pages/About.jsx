import React from 'react';
import { NavLink } from 'react-router-dom';

import lessonImage from '../images/lesson3.jpg';

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            
            <div className="relative bg-primary py-20 px-4 sm:px-6 lg:px-8 shadow-lg">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-primary mix-blend-multiply" />
                </div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Про STEAM CITY
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-purple-100">
                        Місце, де технології зустрічаються з творчістю, а навчання стає захопливою пригодою.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                            Наша місія
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Ми віримо, що кожна дитина - це винахідник. У STEAM CITY ми не просто вчимо формулам, ми допомагаємо зрозуміти, як працює світ.
                            Наша методика поєднує <span className="font-bold text-primary">S</span>cience (Науку), <span className="font-bold text-primary">T</span>echnology (Технології), <span className="font-bold text-primary">E</span>ngineering (Інженерію), <span className="font-bold text-primary">A</span>rt (Мистецтво) та <span className="font-bold text-primary">M</span>athematics (Математику).
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Наші викладачі - це практики, які закохані у свою справу. Ми створюємо середовище, де помилки - це лише крок до відкриття, а питання "Чому?" звучить частіше за все.
                        </p>
                        
                        <div className="flex justify-center">
                            <NavLink to="/contacts" 
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-accent transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                                Зв'язатися з нами
                            </NavLink>
                        </div>
                    </div>

                    <div className="mt-10 lg:mt-0 relative">
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        <div className="relative rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img 
                                className="w-full h-full object-cover"
                                src={lessonImage} 
                                alt="STEAM lesson" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Чому обирають нас?</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Сучасний підхід до освіти
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-2xl mb-4">
                                🚀
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Інноваційні програми</h3>
                            <p className="text-gray-600">
                                Ми постійно оновлюємо наші курси, додаючи робототехніку, програмування та 3D-моделювання.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-2xl mb-4">
                                🤝
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Індивідуальний підхід</h3>
                            <p className="text-gray-600">
                                Маленькі групи (до 6 осіб) дозволяють викладачу приділити увагу кожному учню.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-2xl mb-4">
                                🏆
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Практичний результат</h3>
                            <p className="text-gray-600">
                                Учні створюють власні проєкти, ігри та моделі, які можна показати друзям та батькам.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-primary py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">2+</div>
                        <div className="text-purple-200">Роки досвіду</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">100+</div>
                        <div className="text-purple-200">Випускників</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">10+</div>
                        <div className="text-purple-200">Курсів</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">100%</div>
                        <div className="text-purple-200">Любові до дітей</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;