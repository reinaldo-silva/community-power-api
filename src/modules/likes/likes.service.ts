import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../../entities/like.entity';
import { PostsService } from '../posts/posts.service';
import {
  CreateLikeDto,
  LikePostParamDto,
  LikeUserParamDto,
} from './dtos/like.dto';
import { ResponseCreateLike } from './interfaces/like.interface';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private postsService: PostsService,
  ) {}

  async createRelation({
    postId,
    userId,
  }: CreateLikeDto): Promise<ResponseCreateLike> {
    const likeFound = await this.likesRepository.findOneBy({ postId, userId });

    if (!likeFound) {
      const newLike = Object.assign(new Like(), { postId, userId });

      const createdLike = await this.likesRepository
        .save(newLike)
        .catch((err) => {
          console.log({ err });
          return err;
        });
      await this.postsService.evaluationCalc({ postId });

      return { like: createdLike, message: 'Like!' };
    }

    const removedLike = await this.likesRepository
      .remove(likeFound)
      .catch((err) => {
        console.log({ err });
        return err;
      });

    await this.postsService.evaluationCalc({ postId });

    return { like: removedLike, message: 'DesLike!' };
  }

  findAllByPostId({ postId }: LikePostParamDto): Promise<Like[]> {
    return this.likesRepository.find({
      where: { postId },
      relations: ['user'],
    });
  }

  findAllByUserId({ userId }: LikeUserParamDto): Promise<Like[]> {
    return this.likesRepository.find({
      where: { userId },
      relations: ['post'],
    });
  }
}
