import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { FriendshipModule } from './friendship/friendship.module';
import { ChatroomModule } from './chatroom/chatroom.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          secret: 'jincheng',
          signOptions: {
            expiresIn: '30m',
          },
        };
      },
    }),
    ChatroomModule,
    UserModule,
    PrismaModule,
    EmailModule,
    RedisModule,
    FriendshipModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
