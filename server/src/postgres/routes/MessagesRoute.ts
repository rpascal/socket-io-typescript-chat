
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { MessageService, MessageExpandedModel, MessageModel } from "../models/messages";


@injectable()
export class MessagesRoute {
    private router: Router = express.Router();
    @inject(TYPES.MessageService) private MessageService: MessageService;
    private socket: SocketIO.Socket;
    private io: SocketIO.Server;

    public getRoute(): Router {


        this.router.route("/:ConversationID")
            .get((req: Request, res: Response) => {
                const ConversationID: number = +req.params.ConversationID;
                this.MessageService.getAll(ConversationID).then((data: MessageExpandedModel[]) => {
                    res.json(data);
                });
            }).post(async (req: Request, res: Response) => {

                try {
                    const ConversationID: number = +req.params.ConversationID;
                    const bodyModel: MessageModel = req.body as MessageModel;
                    const newMessage: MessageExpandedModel = await this.MessageService.insert(bodyModel);
                    // this.io.to().on
                    this.io.in(ConversationID.toString()).emit('message', newMessage);
                    res.json(true);
                    return;
                } catch (err) {
                    res.status(400).send(err);
                    return;
                }

                //console.log(req, res);
            })




        return this.router;
    }


    public setIO(io: SocketIO.Server) {
        this.io = io;
    }

    public setSocket(socket: SocketIO.Socket) {
        this.socket = socket;
    }

}
