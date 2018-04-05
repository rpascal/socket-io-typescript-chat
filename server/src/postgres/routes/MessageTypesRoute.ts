
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { MessageTypeService } from "../models/messageType";


@injectable()
export class MessageTypesRoute {
    private router: Router = express.Router();
    @inject(TYPES.MessageTypeService) private MessageTypeService: MessageTypeService;

    public getRoute(): Router {

        this.router.route("/")
            .get((req: Request, res: Response) => {
                this.MessageTypeService.getAll().then(data => {
                    res.json(data);
                });
            }).post((req, res) => {
                console.log(req, res);
            })

        return this.router;
    }

}
