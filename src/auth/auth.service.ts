import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

export type Users = any;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user?.password !== pass) throw new UnauthorizedException();

    const { password, ...result } = user;

    // Create Payload JWT
    const payload = {
      sub: user.name,
      email: user.email,
    };
    return await this.jwtService.signAsync(payload);
  }
}
