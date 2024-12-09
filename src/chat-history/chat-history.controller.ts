import { Controller, Get, Param } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Get('list/:chatRoomId')
  list(@Param('chatRoomId') chatRoomId: number) {
    return this.chatHistoryService.list(+chatRoomId)
  }
}
