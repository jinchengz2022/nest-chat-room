import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryDTO } from './add-history.dto';

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async list(chatRoomId: number) {
    const historyRes = await this.prismaService.chatHistory.findMany({
      where: { chatRoomId },
    });

    const res = [];

    for (let i = 0; i < historyRes.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: { id: historyRes[i].senderId },
        select: { userName: true, nickName: true, headPic: true, id: true },
      });
      res.push({ ...historyRes[i], sender: user, type: historyRes[i].type === 0 ? 'text' : 'image' });
    }

    return res;
  }

  async add(chatRoomId: number, history: HistoryDTO) {
    return this.prismaService.chatHistory.create({
      data: history,
    });
  }
}
