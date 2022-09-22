import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import typeormConfig from './config/typeorm.config';
import { LikesController } from './modules/likes/likes.controller';
import { LikesModule } from './modules/likes/likes.module';
import { LikesService } from './modules/likes/likes.service';
import { PostsController } from './modules/posts/posts.controller';
import { PostsModule } from './modules/posts/posts.module';
import { PostsService } from './modules/posts/posts.service';
import { SessionsController } from './modules/sessions/sessions.controller';
import { SessionsModule } from './modules/sessions/sessions.module';
import { SessionsService } from './modules/sessions/sessions.service';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
import { TypeOrmUsersRepository } from './repositories/implementations/TypeOrmUsersRepository';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UsersModule,
    PostsModule,
    LikesModule,
    SessionsModule,
  ],
  controllers: [
    UsersController,
    PostsController,
    SessionsController,
    LikesController,
  ],
  providers: [
    UsersService,
    PostsService,
    SessionsService,
    LikesService,
    { provide: 'IUserRepository', useClass: TypeOrmUsersRepository },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
