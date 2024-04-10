import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dtos/CreatePostDto';

@Injectable()
export class PostsService {
    constructor(private prismaService: PrismaService) {}
    
    async create(createPostDto: CreatePostDto, userId: number) {
        return this.prismaService.post.create({
            data: {
                title: createPostDto.title,
                content: createPostDto.content,
                published: createPostDto.published,
                authorId: userId
            }
        })
    }

    async findAll() {
        return this.prismaService.post.findMany({
            where: { published: true },
            include: { author: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            } }
        })
    }

    async findOne(id: number) {
        return this.prismaService.post.findUnique({
            where: { id },
            include: { author: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            } }
        })
    }

    async update(id: number, updatePostDto: CreatePostDto, userId: number) {
        this.prismaService.post.findUnique({
            where: { id }
        }).then(post => {
            if (post.authorId !== userId) {
                throw new ForbiddenException('You cannot delete this post')
            }
            return post
        })

        return this.prismaService.post.update({
            where: { id },
            data: {
                title: updatePostDto.title,
                content: updatePostDto.content,
                published: updatePostDto.published
            }
        })
    }

    async delete(id: number, userId: number) {
        await this.prismaService.post.findUnique({
            where: { id }
        }).then(post => {
            if (post.authorId !== userId) {
                throw new ForbiddenException('You cannot delete this post')
            }
            return post
        })
    
        return this.prismaService.post.delete({
            where: { id }
        })
    }
}
