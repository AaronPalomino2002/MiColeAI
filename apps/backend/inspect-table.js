const mysql = require('mysql2/promise');

async function inspectTable() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '123456',
            database: 'project_moon'
        });
        const [rows] = await connection.query('DESCRIBE students;');
        console.log('Columns in students table:');
        rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
        await connection.end();
    } catch (error) {
        console.error('Error inspecting table:', error.message);
        process.exit(1);
    }
}

inspectTable();
