import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AddFriendshipDto } from './dto/add-friendship.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('Add')
  @RequireLogin()
  add(@Body() addFriendshipDto: AddFriendshipDto, @UserInfo('userId') userId: number) {
    return this.friendshipService.add(addFriendshipDto, userId);
  }

  @Get('ToAddList')
  @RequireLogin()
  toAddList(@UserInfo('userId') userId: number) {
    return this.friendshipService.toAddList(userId);
  }

  @Get('Agree/:id')
  @RequireLogin()
  agree(@Param('id') id: number, @UserInfo('userId') userId: number) {
    return this.friendshipService.agree(id, userId);
  }

  @Get('Reject/:id')
  @RequireLogin()
  reject(@Param('id') id: number, @UserInfo('userId') userId: number) {
    return this.friendshipService.reject(id, userId);
  }

  @Get('Delete/:id')
  @RequireLogin()
  delete(@Param('id') id: number, @UserInfo('userId') userId: number) {
    return this.friendshipService.delete(id, userId);
  }

  @Get('List')
  @RequireLogin()
  getFriendship(@UserInfo('userId') userId: number) {
    return this.friendshipService.getFriendship(userId);
  }
}
