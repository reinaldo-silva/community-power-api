import { Like } from '../../../entities/like.entity';

export interface ResponseCreateLike {
  like: Like;
  message: string;
}
