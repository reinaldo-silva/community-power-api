import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post as PostHttp,
} from '@nestjs/common';
import { Post } from '../../entities/post.entity';
import { CreatePostDto, ParamPostDto } from './post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll(): Promise<Post[]> {
    return this.postsService.findAll();
  }

  @Get('/:slug')
  findBySlug(@Param() { slug }: { slug: string }): Promise<Post> {
    return this.postsService.findOneBySlug(slug);
  }

  @PostHttp()
  public createPost(@Body() body: CreatePostDto): Promise<Post> {
    return this.postsService.create(
      { ...body, author_id: undefined },
      body.author_id,
    );
  }

  @Patch('/evaluationCalc/:postId')
  public evaluationCalc(@Param() { postId }: ParamPostDto): Promise<Post> {
    return this.postsService.evaluationCalc({ postId });
  }
}
