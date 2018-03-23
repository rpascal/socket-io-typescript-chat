import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message, User } from './model';

import { MongooseInit } from './mongoose/connection'
import { ChatRoom } from './mongoose/models/chatRoom'


export class ChatServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor(public MongooseInit: MongooseInit) {
        console.log("Heello")
        MongooseInit.connect();

        console.log("Heello 2")

        ChatRoom.add({ roomName: "Custom Test!!" });
        ChatRoom.add({ roomName: "Custom Test 222!!" });

        // var room = new ChatRoom();
        // room.roomName = "This is test";
        // room.save();

        // var room2 = new ChatRoom();
        // room2.roomName = "This is test - 2";
        // room2.save();

        ChatRoom.getAll().then(val => {
            if (val) {
                console.log("Rooms: ", val)
            } else {
                console.log("Nothing in rooms")
            }
        })

        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
        this.app.get("/", (err, res, next) => {
            
            ChatRoom.add({ roomName: "Custom Test 222!!" });
            ChatRoom.getAll().then(val => {
               
                if (val) {
                    res.json(val)
                    console.log("Rooms: ", val)
                } else {
                    res.json("no rooms")
                    console.log("Nothing in rooms")
                }
            }).catch(err=>{
                res.json("err catch")
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

    private listen(): void {
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
