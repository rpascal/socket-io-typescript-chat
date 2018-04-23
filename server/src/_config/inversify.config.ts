import 'reflect-metadata';

import { Container } from 'inversify';

import { ChatServer } from '../chat-server';
import { BasePostgres } from '../postgres/base';
import { ConversationService } from '../postgres/models/conversation';
import { MessageService } from '../postgres/models/messages';
import { MessageTypeService } from '../postgres/models/messageType';
import { UserService } from '../postgres/models/users';
import { ConversationsRoute } from '../postgres/routes/ConversationsRoute';
import { MessagesRoute } from '../postgres/routes/MessagesRoute';
import { MessageTypesRoute } from '../postgres/routes/MessageTypesRoute';
import { UsersRoute } from '../postgres/routes/UsersRoute';
import { TYPES } from './inversifyTypes';




const inversifyContainer = new Container();
inversifyContainer.bind<ChatServer>(TYPES.ChatServer).to(ChatServer);

inversifyContainer.bind<BasePostgres>(TYPES.BasePostgres).to(BasePostgres);

inversifyContainer.bind<UsersRoute>(TYPES.UsersRoute).to(UsersRoute);
inversifyContainer.bind<UserService>(TYPES.UserService).to(UserService);
inversifyContainer.bind<MessageService>(TYPES.MessageService).to(MessageService);
inversifyContainer.bind<MessageTypeService>(TYPES.MessageTypeService).to(MessageTypeService);
inversifyContainer.bind<ConversationService>(TYPES.ConversationService).to(ConversationService);

inversifyContainer.bind<MessagesRoute>(TYPES.MessagesRoute).to(MessagesRoute);
inversifyContainer.bind<MessageTypesRoute>(TYPES.MessageTypesRoute).to(MessageTypesRoute);

inversifyContainer.bind<ConversationsRoute>(TYPES.ConversationsRoute).to(ConversationsRoute);



export { inversifyContainer };