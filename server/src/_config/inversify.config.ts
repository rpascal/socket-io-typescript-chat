import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./inversifyTypes";
import { BasePostgres } from "../postgres/base";
import { ChatServer } from "../chat-server";




const inversifyContainer = new Container();
inversifyContainer.bind<ChatServer>(TYPES.ChatServer).to(ChatServer);

inversifyContainer.bind<BasePostgres>(TYPES.BasePostgres).to(BasePostgres);


export { inversifyContainer };