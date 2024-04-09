import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UsersModule {}
