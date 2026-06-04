import {
    Controller, Get, Post, Body, Param,
    UseGuards, Req, UseInterceptors, UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('sessions')
    async createSession(@Req() req: any, @Body('agentId') agentId: string) {
        return this.chatService.createSession(req.user.userId, agentId);
    }

    @Get('sessions')
    async findSessions(@Req() req: any) {
        return this.chatService.findSessionsByStudent(req.user.userId);
    }

    @Get('sessions/:sessionId/messages')
    async findMessages(@Param('sessionId') sessionId: string) {
        return this.chatService.findMessagesBySession(sessionId);
    }

    @Post('sessions/:sessionId/messages')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: memoryStorage(),
            fileFilter: (_req, file, cb) => {
                if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
                    return cb(new BadRequestException('Only image files are allowed'), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    )
    async sendMessage(
        @Param('sessionId') sessionId: string,
        @Body() body: Record<string, string>,
        @UploadedFile() image?: Express.Multer.File,
    ) {
        const content = body?.content ?? '';
        return this.chatService.sendStudentMessage(sessionId, content, image);
    }
}
