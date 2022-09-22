import slugify from 'slugify';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { calculateEvaluationPost } from '../utils/calculateEvaluationPost';
import { Like } from './like.entity';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column({ default: 0, type: 'float' })
  evaluation: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user?: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  generateSlug(text = this.title): void {
    this.slug = slugify(text);
  }

  calculatedEvaluation(): void {
    this.evaluation = calculateEvaluationPost({
      evaluation: this.evaluation,
      post: {
        varPost: [this.description, this.title],
        likes: this.likes.length,
        likesRange: [1, 2, 10, 20],
      },
      user: {
        varUser: [this.user?.name],
        totalPosts: this.user?.posts.length,
        postsRange: [1, 2, 3, 4, 90],
      },
    });

    delete this.user;
    delete this.likes;
  }
}
