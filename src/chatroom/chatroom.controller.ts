import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/custom.decorator';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('CreateGroup')
  @RequireLogin()
  createGroup(@Query('name') name: string, @UserInfo('userId') userId: number) {
    if (!userId) {
      throw new BadRequestException('未登录');
    }
    return this.chatroomService.createGroup(name, userId);
  }

  @Get('CreateOneByOne/:friendId')
  @RequireLogin()
  createOneByOne(
    @Param('friendId') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!userId) {
      throw new BadRequestException('未登录');
    }
    return this.chatroomService.createOneByOne(friendId, userId);
  }

  @Get('ChatList')
  @RequireLogin()
  chatList(@Query('type') type: boolean, @UserInfo('userId') userId: number) {
    return this.chatroomService.chatList(type, userId)
  }

  @Get('JoinChatRoom')
  @RequireLogin()
  joinChatRoom(@Query('chatRoomName') chatRoomName: string, @UserInfo('userId') userId: number) {
    return this.chatroomService.joinChatRoom(chatRoomName, userId)
  }

  @Get('QuitChatRoom/:chatRoomId')
  @RequireLogin()
  quitChatRoom(@Param('chatRoomId') chatRoomId: number, @UserInfo('userId') userId: number) {
    return this.chatroomService.quitChatRoom(chatRoomId, userId)
  }

  @Get('ChatMemberList/:chatRoomId')
  @RequireLogin()
  chatMemberList(@Param('chatRoomId') chatRoomId: number,@UserInfo('userId') userId: number) {
    return this.chatroomService.chatMemberList(chatRoomId, userId)
  }
}
