const mysql = require('mysql2/promise');

async function createDb() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '123456',
        });
        await connection.query('CREATE DATABASE IF NOT EXISTS project_moon;');
        console.log('Database project_moon created or already exists.');
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error.message);
        process.exit(1);
    }
}

createDb();
