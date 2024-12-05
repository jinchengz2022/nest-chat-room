import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/md5';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userName: createUserDto.userName,
      },
    });

    const code = await this.redisService.get(`register_${createUserDto.email}`);

    if (!code) {
      throw new BadRequestException('验证码已失效请重新发送');
    }

    if (code !== createUserDto.captcha) {
      throw new BadRequestException('验证码错误');
    }

    if (user) {
      throw new BadRequestException('该用户已存在，请重新输入');
    }

    delete createUserDto.captcha;

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: md5(createUserDto.password),
      },
    });
  }

  async getCode(params: { to: string; action?: string }) {
    const code = Math.random().toString().substring(2, 8);
    try {
      await this.emailService.sendMail({
        to: params.to,
        subject: `您的注册验证码为：${code}`,
      });
      await this.redisService.set(`register_${params.to}`, code);
      return 'success';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(params: Pick<CreateUserDto, 'userName' | 'password'>) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userName: params.userName,
      },
    });

    if (!user) {
      throw new BadRequestException('该用户不存在');
    }

    if (user.password === md5(params.password)) {
      return {
        token: this.jwtService.sign(
          {
            userId: user.id,
            userName: user.userName,
          },
          { expiresIn: '7d' },
        ),
      };
    }

    throw new BadRequestException('密码错误');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
