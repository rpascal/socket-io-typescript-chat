
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { ConversationService, ConversationExpandedModel } from "../models/conversation";
import { Subject } from "rxjs/Subject";

@injectable()
export class ConversationsRoute {
    private router: Router = express.Router();
    private socket: SocketIO.Socket;
    private io: SocketIO.Server;

    private added: Subject<number[]> = new Subject<number[]>();
    @inject(TYPES.ConversationService) private ConversationService: ConversationService;

    public getRoute(): Router {

        this.router.route("/:userID")
            .get(async (req: Request, res: Response) => {
                const userID: number = +req.params.userID;

                try {
                    const conversations = await this.ConversationService.getUsersConversations(userID);
                    res.json(conversations);
                    return;
                } catch (err) {
                    res.status(400).send(err);
                    return;
                }
            })


        this.router.route("/create")
            .post(async (req, res) => {
                const bodyModel: ConversationExpandedModel = req.body as ConversationExpandedModel;

                try {
                    await this.ConversationService.create(bodyModel);
                    this.io.emit('conversationAdded', bodyModel.users);
                    res.json(true);
                    return;
                } catch (err) {
                    res.status(400).send(err);
                    return;
                }
            })

        this.router.route("/addUsers")
            .post(async (req, res) => {
                const bodyModel = req.body;
                try {
                    await this.ConversationService.addUsers(bodyModel.conversationID, bodyModel.users);
                    res.json(true);
                    return;
                } catch (err) {
                    res.status(400).send(err);
                    return;
                }
            })


        this.router.route("/getUsersNotInConversation/:conversationID")
            .get(async (req, res) => {
                const conversationID: number = +req.params.conversationID;
                try {
                    const users = await this.ConversationService.getUsersNotInConversation(conversationID);
                    res.json(users);
                    return;
                } catch (err) {
                    res.status(400).send(err);
                    return;
                }
            })



        this.router.route("/removeUser")
            .post(async (req, res) => {
                const bodyModel = req.body;
                try {
                    await this.ConversationService.removeUser(bodyModel.conversationID, bodyModel.userID);
                    res.json(true);
                    return;
                } catch (err) {
                    res.status(400).send(err);
                    return;
                }
            })

        return this.router;
    }

    public setIO(io: SocketIO.Server) {
        this.io = io;
    }

    public setSocket(socket: SocketIO.Socket) {
        this.socket = socket;
    }

    public monitorAdded() {
        return this.added;
    }



}
