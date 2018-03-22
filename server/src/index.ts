import { ChatServer } from './chat-server';

import { MongooseInit } from './mongoose/connection'

let app = new ChatServer(new MongooseInit()).getApp();
export { app };
