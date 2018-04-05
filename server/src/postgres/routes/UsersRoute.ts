
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { UserService } from "../models/users";


@injectable()
export class UsersRoute {
    private router: Router = express.Router();
    @inject(TYPES.UserService) private UserService: UserService;

    public getRoute(): Router {
        
        this.router.route("/")
            .get((req: Request, res: Response) => {
                this.UserService.getAll().then(data => {
                    res.json(data);
                });
            }).post((req, res) => {
                console.log(req, res);
            })


        return this.router;
    }

}