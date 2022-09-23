import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { NotificationsGateway } from '../providers/notification.gateway';

export default {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'backdb',
  password: 'backdb',
  database: 'backdb',
  entities: [User, Post, Like, NotificationsGateway],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
} as TypeOrmModuleOptions;
