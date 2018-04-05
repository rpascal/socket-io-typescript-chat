
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { MessageService, MessageExpandedModel } from "../models/messages";


@injectable()
export class MessagesRoute {
    private router: Router = express.Router();
    @inject(TYPES.MessageService) private MessageService: MessageService;


    public getRoute(): Router {


        this.router.route("/:ConversationID")
            .get((req: Request, res: Response) => {
                const ConversationID: number = +req.params.ConversationID;
                this.MessageService.getAll(ConversationID).then((data: MessageExpandedModel[]) => {
                    res.json(data);
                });
            }).post((req: Request, res: Response) => {
                const ConversationID: number = +req.params.ConversationID;
                console.log(req, res);
            })


        return this.router;
    }

}
