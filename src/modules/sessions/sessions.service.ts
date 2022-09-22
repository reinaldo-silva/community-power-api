import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { jwt } from '../../config';
import { User } from '../../entities/user.entity';
import { CreateSessionDto, IResponseSession } from './session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async authenticateUser(data: CreateSessionDto): Promise<IResponseSession> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'salt', 'password', 'name'],
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwdMatched = await user.validatePassword(password, user.salt);

    if (!passwdMatched) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const { secret, expiresIn } = jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      // expiresIn,
    });

    return {
      user: {
        email: data.email,
        id: user.id,
        name: user.name,
      },
      token,
    };
  }
}
