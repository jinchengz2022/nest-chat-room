import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

interface JwtUserData {
  userId: number;
  userName: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject()
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('未登录');
    }

    try {
      const token = authorization.split('Bearer ')[1];
      const data = this.jwtService.verify(token);

      request.user = {
        userId: data.userId,
        userName: data.userName,
      };

      response.header(
        'token',
        this.jwtService.sign(
          {
            userId: data.userId,
            userName: data.userName,
          },
          {
            expiresIn: '7d',
          },
        ),
      );

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
