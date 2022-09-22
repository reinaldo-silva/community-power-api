import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Like {
  @CreateDateColumn()
  createdAt: Date;

  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  postId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
