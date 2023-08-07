import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuth } from '../interfaces/auth';
import { UsersRepository } from '../repositories/users/users.repository';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  @Post()
  async loginUser(@Body() { email, password }: UserAuth): Promise<{
    token: string;
  }> {
    if (!email || !password)
      throw new HttpException(
        'Email ou senha incorretos.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.usersRepository.getUser(email);
    if (!user || user.password !== password) throw new UnauthorizedException();
    return this.jwtSign(user.id, user.company_id);
  }

  async jwtSign(userId: string, companyId: string) {
    const payload = { user: userId, company: companyId };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}