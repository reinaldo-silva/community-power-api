import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export interface IResponseSession {
  user: {
    email: string;
    id: string;
    name: string;
  };
  token: string;
}
