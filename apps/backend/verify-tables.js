const mysql = require('mysql2/promise');

async function verifyTables() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '123456',
            database: 'project_moon'
        });
        const [rows] = await connection.query('SHOW TABLES;');
        console.log('Tables in project_moon:');
        rows.forEach(row => console.log(`- ${Object.values(row)[0]}`));
        await connection.end();
    } catch (error) {
        console.error('Error verifying tables:', error.message);
        process.exit(1);
    }
}

verifyTables();
