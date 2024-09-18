import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser({ id: +id });
  }

  @Get()
  async getUsers() {
    return this.userService.getUsers({});
  }

  @Post()
  async createUser(@Body() userData: { name?: string; email: string }) {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: { name?: string; email?: string },
  ) {
    return this.userService.updateUser({
      where: { id: +id },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id: +id });
  }
}
