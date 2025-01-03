import { Inject, Injectable } from '@nestjs/common';
import { AddFriendshipDto } from './dto/add-friendship.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const requestStatus = {
  0: '待添加',
  1: '已添加',
  2: '已拒绝'
}

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(addFriendshipDto: AddFriendshipDto, userId: number) {
    const addUser = await this.prismaService.user.findUnique({
      where: { userName: addFriendshipDto.userName },
    });

    await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: addUser.id,
        reason: addFriendshipDto?.reason || '',
        status: 0,
      },
    });

    return 'success';
  }

  // 我发送的添加
  async toAddList(userId: number) {
    const fromUserIds = await this.prismaService.friendRequest.findMany({
      where: {
        fromUserId: userId,
      },
    });

    const res = [];

    for (let i = 0; i < fromUserIds.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: { id: fromUserIds[i].toUserId },
      });
      res.push({
        ...user,
        state: fromUserIds[i].status,
        reason: fromUserIds[i].reason,
        isMe: true // 是否是我发送的添加请求
      });
    }

    return res;
  }

  // 添加我的用户的列表
  async AddList(userId: number) {
    const fromUserIds = await this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
        status: 0
      },
    });

    const res = [];

    for (let i = 0; i < fromUserIds.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: { id: fromUserIds[i].fromUserId },
      });
      res.push({
        ...user,
        state: fromUserIds[i].status,
        reason: fromUserIds[i].reason
      });
    }

    return res;
  }

  async requestList(userId: number) {
    const res1 = await this.AddList(userId);
    const res2 = await this.toAddList(userId);

    return [...res1, ...res2]
  }

  async agree(friendId: number, userId: number) {

    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId:  friendId,
        toUserId: userId,
        status: 0,
      },
      data: { status: 1 },
    });

    const user = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    });

    if (!user.length) {
      await this.prismaService.friendship.create({
        data: {
          friendId,
          userId,
        },
      });
    }

    return 'success';
  }

  async delete(friendId: number, userId: number) {
    await this.prismaService.friendship.deleteMany({
      where: {
        friendId,
        userId,
      },
    });

    return 'success';
  }

  async reject(id: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: userId,
        toUserId: id,
        status: 0,
      },
      data: { status: 2 },
    });

    return 'success';
  }

  async getFriendship(userId: number) {
    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          {
            userId,
          },
          {
            friendId: userId,
          },
        ],
      },
    });

    const set = new Set<number>();
    friends.forEach((i) => {
      set.add(i.friendId);
      set.add(i.userId);
    });

    const friendIds = [...set].filter((i) => i !== userId);

    const res = [];

    for (let i = 0; i < friendIds.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: friendIds[i],
        },
        select: {
          id: true,
          userName: true,
          nickName: true,
          email: true,
        },
      });
      res.push(user);
    }
    return res;
  }
}
