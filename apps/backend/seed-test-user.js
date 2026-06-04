const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: path.join(__dirname, '.env') });

async function seedUser() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_NAME || 'project_moon',
    });

    const email = 'student@test.com';
    const password = 'password123';
    const firstName = 'Estudiante';
    const lastName = 'Prueba';

    try {
        const [existing] = await connection.execute('SELECT id FROM students WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('User already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        await connection.execute(
            'INSERT INTO students (id, email, password, first_name, last_name, plan_type, tokens_balance, streak_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, email, hashedPassword, firstName, lastName, 'free', 100, 0]
        );

        console.log('User seeded successfully');
        console.log('Email:', email);
        console.log('Password:', password);
    } catch (error) {
        console.error('Error seeding user:', error);
    } finally {
        await connection.end();
    }
}

seedUser();
