
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { ConversationService } from "../models/conversation";


@injectable()
export class ConversationsRoute {
    private router: Router = express.Router();
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

                // this.ConversationService.getUsersConversations(userID).then(data => {
                //     res.json(data);
                // });
            }).post((req, res) => {
                console.log(req, res);
            })

        this.router.route("create/:userID")
            .post((req, res) => {
                console.log(req, res);
            })

        return this.router;
    }

}
