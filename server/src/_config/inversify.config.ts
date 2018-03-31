import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./inversifyTypes";
import { BasePostgres } from "../postgres/base";
import { ChatServer } from "../chat-server";
import { UsersRoute } from "../postgres/routes/UsersRoute";




const inversifyContainer = new Container();
inversifyContainer.bind<ChatServer>(TYPES.ChatServer).to(ChatServer);

inversifyContainer.bind<BasePostgres>(TYPES.BasePostgres).to(BasePostgres);

inversifyContainer.bind<UsersRoute>(TYPES.UsersRoute).to(UsersRoute);


export { inversifyContainer };