import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface User {
  name: string;
  onChat: string;
  socketId: string;
}

interface Messages {
  description: string;
  moment: Date;
  chat: string;
  user: {
    name: string;
  };
}

const chats = [
  { description: 'Geral', id: 1 },
  { description: 'Back end', id: 2 },
  { description: 'Front end', id: 3 },
  { description: 'Infra', id: 4 },
  { description: 'Mobile', id: 5 },
  { description: 'RH', id: 6 },
];

@WebSocketGateway({
  cors: true,
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('AppGateway');
  public users: User[] = [];
  public messages: Messages[] = [];

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);

    const arrayChats = chats.map((chat) => ({
      ...chat,
      usersConnects:
        this.users
          .filter((user) => user.onChat === String(chat.id))
          .map((user) => user.name) || [],
      usersSocketIds:
        this.users
          .filter((user) => user.onChat === String(chat.id))
          .map((user) => user.socketId) || [],
      messagesCount: this.messages.filter(
        (message) => message.chat === String(chat.id),
      ).length,
    }));

    client.emit('chats', { arrayChats });
  }

  async handleDisconnect(client: Socket, ...args: any[]) {
    console.log(`Client disconnected: ${client.id}`);

    this.users = this.users.filter((e) => e.socketId !== client.id);
  }

  @SubscribeMessage('join')
  async joinChat(
    client: Socket,
    { name, chat }: { name: string; chat: number },
  ) {
    client.join(String(chat));

    const userFound =
      this.users.findIndex((user) => user.socketId === client.id) >= 0;

    if (!userFound)
      this.users = [
        ...this.users,
        { name, onChat: String(chat), socketId: client.id },
      ];

    client.emit('messages', {
      messages: this.messages.filter(
        (message) => message.chat === String(chat),
      ),
    });

    this.chatInfos();
  }

  @SubscribeMessage('leave')
  async leaveChat(client: Socket, {}) {
    const userFound = this.users.find((user) => user.socketId === client.id);

    userFound && client.leave(String(userFound.onChat));

    this.users = this.users.filter((user) => user.socketId !== client.id);

    this.chatInfos();
  }

  @SubscribeMessage('send')
  async sendMessage(
    client: Socket,
    { name, chat, message }: { name: string; chat: number; message: string },
  ) {
    this.messages = [
      {
        chat: String(chat),
        user: { name },
        description: message,
        moment: new Date(),
      },
      ...this.messages,
    ];

    this.server.to(String(chat)).emit('messages', {
      messages: this.messages.filter(
        (message) => message.chat === String(chat),
      ),
    });

    this.chatInfos();
  }

  chatInfos() {
    const arrayChats = chats.map((chat) => ({
      ...chat,
      usersConnects:
        this.users
          .filter((user) => user.onChat === String(chat.id))
          .map((user) => user.name) || [],
      usersSocketIds:
        this.users
          .filter((user) => user.onChat === String(chat.id))
          .map((user) => user.socketId) || [],
      messagesCount: this.messages.filter(
        (message) => message.chat === String(chat.id),
      ).length,
    }));

    this.server.emit('chats', { arrayChats });
  }

  @SubscribeMessage('getChats')
  getChats() {
    this.chatInfos();
  }
}
