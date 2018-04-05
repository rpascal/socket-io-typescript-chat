import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message, User } from './model';

import { Client } from 'pg';
import { injectable, inject } from "inversify";
import { TYPES } from "./_config/inversifyTypes";
import { BasePostgres } from './postgres/base';

import "reflect-metadata";
import { UsersRoute } from './postgres/routes/UsersRoute';
import { UserService } from './postgres/models/users';
import { MessageService } from './postgres/models/messages';

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
        this.app.use("/users", this.UsersRoute.getRoute());
        this.app.get("/", (err, res, next) => {

            this.MessageService.getAll(123456879).then(data => {
                console.log("message seriovce", data);
            })

            this.UserService.insert({ NAME: 'brianc: ' + Math.random().toString(), password: "password" + Math.random().toString() }).then(res => {
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
    }

    public listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect_error', function (err) {
            // handle server error here
            console.log('Error connecting to server');
        });
        this.io.on('connect', (socket: any) => {


            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
