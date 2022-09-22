import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { Like } from './like.entity';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ select: false })
  @Exclude()
  salt: string;

  @Column()
  email: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }

  async validatePassword(password: string, salt: string): Promise<boolean> {
    const hashBcrypt = await hash(password, salt);

    return hashBcrypt === this.password;
  }
}
