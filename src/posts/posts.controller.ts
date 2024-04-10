import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePostDto } from './dtos/CreatePostDto';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @HttpCode(201)
    @Post()
    @UseGuards(AuthGuard)
    create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
        return this.postsService.create(createPostDto, req.user.id)
    }

    @HttpCode(200)
    @Get()
    findAll() {
        return this.postsService.findAll()
    }


    @HttpCode(200)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(id)
    }


    @HttpCode(200)
    @Put(':id')
    @UseGuards(AuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: CreatePostDto, @Req() req: any) {
        return this.postsService.update(id, updatePostDto, req.user.id)
    }

    @HttpCode(204)
    @Delete(':id')
    @UseGuards(AuthGuard)
    delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.postsService.delete(id, req.user.id)
    }
}
