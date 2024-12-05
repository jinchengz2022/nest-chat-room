import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatroomGateway {
  constructor(private readonly chatroomService: ChatroomService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, room: string) {
    console.log({ room });
    client.join(room);
    this.server.to(room).emit('message', `new user join to ${room}`);

    // return this.chatroomService.create(createChatroomDto);
  }

  @SubscribeMessage('sendRoom')
  sendRoom(client: Socket, payload: any) {
    console.log({ payload });
    this.server.to(payload.room).emit('message', payload.message);
    // return this.chatroomService.findAll();
  }

  @SubscribeMessage('findOneChatroom')
  findOne(@MessageBody() id: number) {
    return this.chatroomService.findOne(id);
  }

  @SubscribeMessage('updateChatroom')
  update(@MessageBody() updateChatroomDto: UpdateChatroomDto) {
    return this.chatroomService.update(updateChatroomDto.id, updateChatroomDto);
  }

  @SubscribeMessage('removeChatroom')
  remove(@MessageBody() id: number) {
    return this.chatroomService.remove(id);
  }
}
