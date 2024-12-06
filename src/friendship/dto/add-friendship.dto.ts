import { IsNotEmpty } from "class-validator";

export class AddFriendshipDto {
    @IsNotEmpty({
        message: '用户名称不能为空'
    })
    userName: string;

    reason: string;
}
