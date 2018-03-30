import { ChatServer } from './chat-server';
import { inversifyContainer } from "./_config/inversify.config";
import { TYPES } from "./_config/inversifyTypes";

const server = inversifyContainer.get<ChatServer>(TYPES.ChatServer);

server.setup();
server.listen();