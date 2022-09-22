import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LikePostParamDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public postId: string;
}

export class LikeUserParamDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public userId: string;
}
export class CreateLikeDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public postId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public userId: string;
}
