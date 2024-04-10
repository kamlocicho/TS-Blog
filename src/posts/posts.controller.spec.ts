import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CreatePostDto } from './dtos/CreatePostDto';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';


describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        global: true,
        secret: "secret",
        signOptions: {expiresIn: '1d'}
      })],
      controllers: [PostsController],
      providers: [PostsService, PrismaService, {
        provide: APP_GUARD,
        useClass: class extends AuthGuard {
          getRequest(context: ExecutionContext) {
            return {
              user: {
                id: 1
              }
            }
          }
        }
      }]
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto = new CreatePostDto();
      createPostDto.title = 'Test Post';
      createPostDto.content = 'Test Content';
      createPostDto.published = true;

      const post = await controller.create(createPostDto, {user: {id: 1}});

      expect(post).toHaveProperty('id');
      expect(post.title).toBe(createPostDto.title);
      expect(post.content).toBe(createPostDto.content);
    });
  })

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = await controller.findAll();

      expect(posts).toBeInstanceOf(Array);
    });
  })

  describe('findOne', () => {
    it('should return a post', async () => {
      const createPostDto = new CreatePostDto();
      createPostDto.title = 'Test Post';
      createPostDto.content = 'Test Content';
      createPostDto.published = true;

      const createdPost = await controller.create(createPostDto, {user: {id: 1}});
      const post = await controller.findOne(createdPost.id);

      expect(post).toHaveProperty('id');
      expect(post.title).toBe(createPostDto.title);
      expect(post.content).toBe(createPostDto.content);
    });
  })

  describe('update', () => {
    it('should update a post', async () => {
      const createPostDto = new CreatePostDto();
      createPostDto.title = 'Test Post';
      createPostDto.content = 'Test Content';
      createPostDto.published = true;

      const createdPost = await controller.create(createPostDto, {user: {id: 1}});
      const updatePostDto = new CreatePostDto();
      updatePostDto.title = 'Updated Post';
      updatePostDto.content = 'Updated Content';
      updatePostDto.published = false;

      const post = await controller.update(createdPost.id, updatePostDto, {user: {id: 1}});

      expect(post).toHaveProperty('id');
      expect(post.id).toBe(createdPost.id);
      expect(post.title).toBe(updatePostDto.title);
      expect(post.content).toBe(updatePostDto.content);
      expect(post.published).toBe(false);
    });
  })

  describe('delete', () => {
    it('should delete a post', async () => {
      const createPostDto = new CreatePostDto();
      createPostDto.title = 'Test Post';
      createPostDto.content = 'Test Content';
      createPostDto.published = true;

      const createdPost = await controller.create(createPostDto, {user: {id: 1}});
      await controller.delete(createdPost.id, {user: {id: 1}});

      const posts = await controller.findAll();

      expect(posts).not.toContainEqual(createdPost);
    });
  })
});
