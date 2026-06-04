const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkUsers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_NAME || 'project_moon',
    });

    try {
        const [rows] = await connection.execute('SELECT email FROM students');
        console.log('Existing users:', rows);
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await connection.end();
    }
}

checkUsers();
