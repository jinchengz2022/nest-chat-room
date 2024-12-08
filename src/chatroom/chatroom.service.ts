import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 一对一聊天
  async createOneByOne(friendId: number, userId: number) {
    const chatRes = await this.prismaService.chatRoom.create({
      data: {
        name: '聊天室：' + Math.random().toString().substring(2, 8),
      },
      select: { id: true },
    });

    await this.prismaService.userChatRoom.create({
      data: {
        userId,
        chatRoomId: chatRes.id,
      },
    });

    await this.prismaService.userChatRoom.create({
      data: {
        userId: Number(friendId),
        chatRoomId: chatRes.id,
      },
    });
    return chatRes.id;
  }

  // 创建群聊
  async createGroup(name: string, userId: number) {
    const chatRes = await this.prismaService.chatRoom.create({
      data: {
        name,
        type: true,
      },
      select: { id: true },
    });

    await this.prismaService.userChatRoom.create({
      data: {
        userId,
        chatRoomId: chatRes.id,
      },
    });

    return 'success';
  }

  async chatList(type: boolean, userId: number) {
    const userChatRoomRes = await this.prismaService.userChatRoom.findMany({
      where: { userId },
      select: { chatRoomId: true },
    });

    const list = await this.prismaService.chatRoom.findMany({
      where: {
        id: {
          in: userChatRoomRes.map((i) => i.chatRoomId),
        },
        type,
      },
      select: { id: true, type: true, name: true },
    });

    const res = [];

    for (let i = 0; i < list.length; i++) {
      const userIds = await this.prismaService.userChatRoom.findMany({
        where: { chatRoomId: list[i].id },
      });
      res.push({
        ...list[i],
        userCount: userIds.length,
        userList: userIds.map((i) => i.userId),
      });
    }

    return res;
  }

  // 加入群聊
  async joinChatRoom(name: string, userId: number) {
    const roomRes = await this.prismaService.chatRoom.findFirst({
      where: { name },
    });
    if (!roomRes) {
      throw new BadRequestException('该群不存在');
    }

    const userAndRoom = await this.prismaService.userChatRoom.findMany({
      where: { chatRoomId: roomRes.id, userId },
    });

    // 已在群中
    if (userAndRoom) {
      return userAndRoom[0].chatRoomId;
    }

    await this.prismaService.userChatRoom.create({
      data: {
        userId,
        chatRoomId: roomRes.id,
      },
    });

    return roomRes.id;
  }

  // 退出群聊
  async quitChatRoom(chatRoomId: number, userId: number) {
    await this.prismaService.userChatRoom.deleteMany({
      where: { chatRoomId, userId },
    });

    return 'success';
  }

  // 聊天人员列表
  async chatMemberList(chatRoomId: number, userId: number) {
    const userList = await this.prismaService.userChatRoom.findMany({
      where: { chatRoomId },
    });

    const res = await this.prismaService.user.findMany({
      where: {
        id: {
          in: userList.map((i) => i.userId),
        },
      },
      select: { createTime: false, updateTime: false },
    });
    return res;
  }
}
