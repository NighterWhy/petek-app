import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get 1-on-1 chat history',
    description:
      'Fetches the full message history exchanged between two users, ordered from oldest to newest.',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'ID of the current (requesting) user',
  })
  @ApiQuery({
    name: 'contactId',
    required: true,
    type: String,
    description: 'ID of the contact user whose conversation is being fetched',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages between the two users (oldest first).',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          content: { type: 'string' },
          senderId: { type: 'string' },
          receiverId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Missing or invalid query parameters.' })
  async getChatHistory(
    @Query('userId') userId: string,
    @Query('contactId') contactId: string,
  ) {
    return this.chatService.getChatHistory(userId, contactId);
  }
}
