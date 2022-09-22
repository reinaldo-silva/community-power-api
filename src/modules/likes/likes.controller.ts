import { Controller, Get, Param, Patch } from '@nestjs/common';
import { GetAuthenticatedUser } from '../../decorators/auth.decorator';
import { Like } from '../../entities/like.entity';
import { LikePostParamDto, LikeUserParamDto } from './dtos/like.dto';
import { ResponseCreateLike } from './interfaces/like.interface';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Patch(':postId')
  public handleLiked(
    @Param() { postId }: LikePostParamDto,
    @GetAuthenticatedUser() userId: string,
  ): Promise<ResponseCreateLike> {
    return this.likesService.createRelation({ userId, postId });
  }

  @Get('/post/:postId')
  public listByPost(
    @Param() { postId }: LikePostParamDto,
    @GetAuthenticatedUser() _: string,
  ): Promise<Like[]> {
    return this.likesService.findAllByPostId({ postId });
  }

  @Get('/user/:userId')
  public listByUser(
    @Param() { userId }: LikeUserParamDto,
    @GetAuthenticatedUser() _: string,
  ): Promise<Like[]> {
    return this.likesService.findAllByUserId({ userId });
  }
}
