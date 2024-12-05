import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [PrismaModule, EmailModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
