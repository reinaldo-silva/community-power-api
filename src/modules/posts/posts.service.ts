import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { CreatePostDto, ParamPostDto } from './post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user', 'likes'],
      order: { createdAt: 'DESC', title: 'DESC' },
    });
  }
  findOneBySlug(slug: string): Promise<Post> {
    return this.postsRepository.findOne({
      where: { slug },
      relations: ['user', 'likes'],
    });
  }

  async create(data: CreatePostDto, userId: string): Promise<Post> {
    if (userId) {
      const userFound = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!userFound) {
        throw new NotFoundException('Author not found!');
      }
    }

    const postFoundByTitle = await this.postsRepository.findOneBy({
      title: data.title,
    });

    if (postFoundByTitle) {
      throw new NotFoundException('Title already exists');
    }

    const newPost = new Post();

    newPost.generateSlug(data.title.toLocaleLowerCase());

    return this.postsRepository.save(
      Object.assign(newPost, {
        ...data,
        user: userId || undefined,
      }),
    );
  }

  async evaluationCalc({ postId }: ParamPostDto): Promise<Post> {
    const postFound = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['likes', 'user', 'user.posts'],
      loadRelationIds: { relations: ['likes', 'user.posts'] },
    });

    if (!postFound) {
      throw new NotFoundException('Post not found!');
    }

    postFound.calculatedEvaluation();

    await this.postsRepository.save(postFound);

    delete postFound.user;
    delete postFound.likes;

    return postFound;
  }
}
