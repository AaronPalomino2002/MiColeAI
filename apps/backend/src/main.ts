import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            // Allow any origin that starts with the configured frontend URL (covers /es, /en, etc.)
            const allowed = origin.startsWith(frontendUrl) || origin === frontendUrl;
            callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
        },
        credentials: true,
    });
    app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), { prefix: '/uploads' });

    const config = new DocumentBuilder()
        .setTitle('EduAI API')
        .setDescription('Backend API for the EduAI student portal')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
