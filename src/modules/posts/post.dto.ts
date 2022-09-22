import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsUUID()
  public author_id: string;
}

export class ParamPostDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public postId: string;
}
