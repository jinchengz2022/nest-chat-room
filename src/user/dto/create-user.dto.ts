import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  userName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  headPic: string;
  
  nickName: string;
}
