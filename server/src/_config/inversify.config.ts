import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./inversifyTypes";
import { BasePostgres } from "../postgres/base";
import { ChatServer } from "../chat-server";
import { UsersRoute } from "../postgres/routes/UsersRoute";
import { UserService } from "../postgres/models/users";
import { MessageService } from "../postgres/models/messages";
import { MessageTypeService } from "../postgres/models/messageType";
import { ConversationService } from "../postgres/models/conversation";




const inversifyContainer = new Container();
inversifyContainer.bind<ChatServer>(TYPES.ChatServer).to(ChatServer);

inversifyContainer.bind<BasePostgres>(TYPES.BasePostgres).to(BasePostgres);

inversifyContainer.bind<UsersRoute>(TYPES.UsersRoute).to(UsersRoute);
inversifyContainer.bind<UserService>(TYPES.UserService).to(UserService);
inversifyContainer.bind<MessageService>(TYPES.MessageService).to(MessageService);
inversifyContainer.bind<MessageTypeService>(TYPES.MessageTypeService).to(MessageTypeService);
inversifyContainer.bind<ConversationService>(TYPES.ConversationService).to(ConversationService);





export { inversifyContainer };