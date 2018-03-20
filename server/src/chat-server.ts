import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message, User } from './model';

import { createClient, RedisClient, print } from 'redis'

export class ChatServer {
    public static readonly PORT: number = 8080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private redis: RedisClient;


    constructor() {
        this.redis = createClient(6379, "redis")
        this.redis.on("error", function (err) {
            console.log("Error " + err);
        });

        this.redis.on("ready", function (ready) {
            console.log("ready " + ready);
        });
        this.redis.on("connect", function (connect) {
            console.log("connect " + connect);
        });


        // this.redis.hset("hash key", "hashtest 1", "some value", print);
        // // this.redis.hset(["hash key", "hashtest 2", "some other value"], print);
        // this.redis.hkeys("hash key", function (err, replies) {
        //     console.log(replies.length + " replies:");
        //     replies.forEach(function (reply, i) {
        //         console.log("    " + i + ": " + reply);
        //     });
        //     this.redis.quit();
        // });

        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
        this.app.get("/", (err, res, next) => {
            res.json("here i am")

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
            // this.io.emit('currentMessages', [{id:979717,avatar:"https://api.adorable.io/avatars/285/979717.png",name:"jk"}]);
            // this.redis.rpop("messages");

            
            this.redis.lrange("messages", 0, -1, (data, reply) => {
                if (reply)
                    reply.forEach(v => this.io.emit('currentMessages', [JSON.parse(v)]));
                    // this.io.emit('currentMessages', JSON.parse(reply.join(",")));
                // reply.forEach(v => console.log(v));
                // console.log("From Redis: ", messages);
            });

            // this.redis.get("messages", (err, reply) => {
            //     if(reply){
            //         console.log("From Redis: ", reply);
            //         // this.io.emit('currentMessages',
            //         // [
            //         //     { from: { id: 12906, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129206, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 2" },
            //         //     { from: { id: 129306, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 3" },
            //         //     { from: { id: 129016, avatar: "https://api.adorable.io/avatars/285/12906.png", name: "ads" }, content: "Hello 4" }
            //         // ]);
            //     }
            // })


            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);

                // this.redis.set("messages", JSON.stringify([m]), print);   
                this.redis.rpush("messages", JSON.stringify(m), function (err, reply) {
                    console.log("rpush:", reply)
                })
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
