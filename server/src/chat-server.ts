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

@injectable()
export class ChatServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;
    @inject(TYPES.UsersRoute) private UsersRoute: UsersRoute;


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


            this.BasePostgres.getPoolClient().then(client => {

                const query = {
                    text: 'SELECT * FROM users'
                }
                client.query(query)
                    .then(query => { console.log(query.rows); res.json(JSON.stringify(query.rows)); })
                    .catch(e => console.error(e.stack))

                const query2 = {
                    text: 'INSERT INTO users(NAME, password) VALUES($1, $2)',
                    values: ['brianc: ' + Math.random().toString(), "password" + Math.random().toString()],
                }
                client.query(query2);
                //     .then(res => console.log(res.rows[0]))
                //     .catch(e => console.error(e.stack))

            })


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
