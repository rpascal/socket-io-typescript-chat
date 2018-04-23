import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as expressJwt from 'express-jwt';
import { createServer, Server } from 'http';
import { inject, injectable } from 'inversify';
import * as socketIo from 'socket.io';

import { AppConfig } from './_config/app.config';
import { TYPES } from './_config/inversifyTypes';
import { BasePostgres } from './postgres/base';
import { MessageService } from './postgres/models/messages';
import { UserService } from './postgres/models/users';
import { ConversationsRoute } from './postgres/routes/ConversationsRoute';
import { MessagesRoute } from './postgres/routes/MessagesRoute';
import { MessageTypesRoute } from './postgres/routes/MessageTypesRoute';
import { UsersRoute } from './postgres/routes/UsersRoute';

@injectable()
export class ChatServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;
    @inject(TYPES.UsersRoute) private UsersRoute: UsersRoute;
    @inject(TYPES.UserService) private UserService: UserService;
    @inject(TYPES.MessageService) private MessageService: MessageService;

    @inject(TYPES.ConversationsRoute) private ConversationsRoute: ConversationsRoute;
    @inject(TYPES.MessagesRoute) private MessagesRoute: MessagesRoute;
    @inject(TYPES.MessageTypesRoute) private MessageTypesRoute: MessageTypesRoute;


    constructor() {


    }


    public setup(): void {


        this.createApp();
        this.config();
        this.createServer();
        this.sockets();

    }



    private createApp(): void {
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(expressJwt({
            secret: AppConfig.secret,
            getToken: function (req) {
                if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                    return req.headers.authorization.split(' ')[1];
                } else if (req.query && req.query.token) {
                    return req.query.token;
                }
                return null;
            }
        }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

        this.app.use("/api/users", this.UsersRoute.getRoute());
        this.app.use("/api/conversations", this.ConversationsRoute.getRoute());
        this.app.use("/api/messages", this.MessagesRoute.getRoute());
        this.app.use("/api/messageTypes", this.MessageTypesRoute.getRoute());


        this.app.get("/", (err, res, next) => {

            this.MessageService.getAll(123456879).then(data => {
                console.log("message seriovce", data);
            })

            this.UserService.insert({ username: 'brianc: ' + Math.random().toString(), password: "password" + Math.random().toString() }).then(res => {
                if (res) {
                    console.log("inserted all good");
                } else {
                    console.log("didnt insert :(")
                }

            });

            res.send("HI")
        })
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
        this.ConversationsRoute.setIO(this.io);
        this.MessagesRoute.setIO(this.io);

    }

    public listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect_error', function (err) {
            // handle server error here
            console.log('Error connecting to server');
        });

        this.io.on('connect', (socket: SocketIO.Socket) => {
            this.ConversationsRoute.setSocket(socket);
            this.MessagesRoute.setSocket(socket);

            socket.on('room', function (room) {            
                socket.leave(room);
                socket.join(room);
                socket.emit("joinedRoom");
            });

            console.log('Connected client on port %s.', this.port);
            // socket.on('message', (m: MessageModel) => {
            //     console.log('[server](message): %s', JSON.stringify(m));
            //     this.io.emit('message', m);
            // });

            // socket.on('disconnect', () => {
            //     console.log('Client disconnected');
            // });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
