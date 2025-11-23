import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js'; 

dotenv.config();
connectDB();

const adminEmail = 'dariia.vasylieva3@gmail.com';
const newPassword = '123456'; 

const setAdminPassword = async () => {
    try {
        console.log(`Пошук користувача ${adminEmail}...`);
        
        const admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            console.error(`Помилка: Користувача з email ${adminEmail} не знайдено.`);
            process.exit(1);
        }
        
        admin.password = newPassword; 
        
        await admin.save(); 

        console.log(`Пароль для Адміна (${adminEmail}) успішно встановлено та хешовано!`);
        process.exit();
    } catch (error) {
        console.error(`Помилка встановлення пароля: ${error.message}`);
        process.exit(1);
    }
};

setAdminPassword();