import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Body, Delete, Param, Patch, Req } from '@nestjs/common/decorators';
  import { User } from 'src/interfaces/users';
  import { UsersRepository } from 'src/repositories/users/users.repository';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly usersRepository: UsersRepository) {}
  
    @Get()
    async getUser(@Query() query: { email: string }): Promise<any> {
      return this.usersRepository.getUser(query.email);
    }
  
    @Post()
    async createUser(@Body() user: User, @Req() req): Promise<User> {
      if (!req.headers.token) throw new UnauthorizedException();
      if (!user.company_id)
        throw new HttpException(
          'ID da empresa não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      return this.usersRepository.createUser(user);
    }
  
    @Patch()
    async updateUser(@Body() user: User, @Req() req): Promise<User> {
      if (!req.headers.token) throw new UnauthorizedException();
      return this.usersRepository.updateUser(user);
    }
  
    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Req() req): Promise<any> {
      if (!req.headers.token) throw new UnauthorizedException();
      return this.usersRepository.deleteUser(id);
    }
  }