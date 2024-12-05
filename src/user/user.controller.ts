import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('CreateUser')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('GetCode')
  getCode(@Query('to') to: string, @Query('action') action?: string) {
    return this.userService.getCode({ to, action });
  }

  @Get('Login')
  login(
    @Query('userName') userName: string,
    @Query('password') password: string,
  ) {
    return this.userService.login({ userName, password });
  }
}
