const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function seed() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '123456',
            database: 'project_moon'
        });

        console.log('Seeding initial data...');

        // 1. Subjects
        const subjects = [
            { id: uuidv4(), name: 'Advanced Biology', description: 'Cellular metabolism and genetics.', icon_name: 'microbiology', color_theme: 'emerald', total_lessons: 24 },
            { id: uuidv4(), name: 'Quantum Physics', description: 'Wave-particle duality and mechanics.', icon_name: 'precision_manufacturing', color_theme: 'blue', total_lessons: 18 },
            { id: uuidv4(), name: 'World History', description: 'Major events of the 20th century.', icon_name: 'history_edu', color_theme: 'amber', total_lessons: 15 },
            { id: uuidv4(), name: 'Organic Chemistry', description: 'Carbon structures and reactions.', icon_name: 'science', color_theme: 'purple', total_lessons: 20 }
        ];

        for (const s of subjects) {
            await connection.query(
                'INSERT INTO subjects (id, name, description, icon_name, color_theme, total_lessons) VALUES (?, ?, ?, ?, ?, ?)',
                [s.id, s.name, s.description, s.icon_name, s.color_theme, s.total_lessons]
            );
        }

        // 2. AI Agents (1 per subject)
        const agents = subjects.map(s => ({
            id: uuidv4(),
            subject_id: s.id,
            name: `${s.name.split(' ')[1] || s.name} Tutor`,
            model_id: 'gemini-1.5-pro',
            system_prompt: `You are a specialized tutor in ${s.name}. Help students master the concepts.`,
            avatar_url: '/assets/avatars/bot-1.png'
        }));

        for (const a of agents) {
            await connection.query(
                'INSERT INTO ai_agents (id, subject_id, name, model_id, system_prompt, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
                [a.id, a.subject_id, a.name, a.model_id, a.system_prompt, a.avatar_url]
            );
        }

        // 3. One Mock Student for testing
        const studentId = uuidv4();
        await connection.query(
            'INSERT INTO students (id, email, password, first_name, last_name, school, grade_level, plan_type, tokens_balance, streak_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [studentId, 'test@eduai.com', '$2b$10$hashedpassword', 'Juan', 'Perez', 'Saint Mary College', '12th Grade', 'free', 500, 5]
        );

        // 4. Enrollments
        for (const s of subjects) {
            await connection.query(
                'INSERT INTO enrollments (id, student_id, subject_id, completed_lessons, status) VALUES (?, ?, ?, ?, ?)',
                [uuidv4(), studentId, s.id, Math.floor(Math.random() * 10), 'active']
            );
        }

        console.log('Seeding completed successfully!');
        await connection.end();
    } catch (error) {
        console.error('Error during seeding:', error.message);
        process.exit(1);
    }
}

seed();
