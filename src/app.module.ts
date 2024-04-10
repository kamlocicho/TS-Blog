import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
