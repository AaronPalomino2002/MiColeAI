/**
 * Vacía TODAS las tablas de la base de datos (TRUNCATE en cascada).
 * Conserva el esquema; elimina solo los datos.
 *
 * Ejecutar:  npm run db:clear
 *
 * ⚠️  Irreversible. Opera sobre la BD configurada en .env.
 */
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'project_moon',
});

async function clear() {
    await dataSource.initialize();
    const dbName = dataSource.options.database;
    console.log(`🔌 Conectado a "${dbName}" en ${(dataSource.options as any).host}`);

    // Descubrir todas las tablas del esquema actual.
    const tables: { TABLE_NAME: string }[] = await dataSource.query(
        `SELECT TABLE_NAME FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
        [dbName],
    );

    if (tables.length === 0) {
        console.log('ℹ️  No hay tablas que vaciar.');
        await dataSource.destroy();
        return;
    }

    console.log(`🧹 Vaciando ${tables.length} tablas...`);

    // Desactivar FK checks para permitir el truncado en cualquier orden (cascada).
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    try {
        for (const { TABLE_NAME } of tables) {
            await dataSource.query(`TRUNCATE TABLE \`${TABLE_NAME}\``);
            console.log(`   ✔ ${TABLE_NAME}`);
        }
    } finally {
        await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    console.log('\n✅ Base de datos vaciada. El esquema se conserva.');
    await dataSource.destroy();
}

clear().catch((err) => {
    console.error('❌ Error al vaciar la base de datos:', err);
    process.exit(1);
});
