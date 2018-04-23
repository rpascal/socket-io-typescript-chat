import { inversifyContainer } from './_config/inversify.config';
import { TYPES } from './_config/inversifyTypes';
import { ChatServer } from './chat-server';

const server = inversifyContainer.get<ChatServer>(TYPES.ChatServer);

server.setup();
server.listen();