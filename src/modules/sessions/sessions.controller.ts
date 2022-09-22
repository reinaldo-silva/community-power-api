import { Body, Controller, Post } from '@nestjs/common';
import { CreateSessionDto, IResponseSession } from './session.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post()
  public createUser(@Body() body: CreateSessionDto): Promise<IResponseSession> {
    return this.sessionsService.authenticateUser(body);
  }
}
