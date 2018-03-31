
import * as express from "express";
import { Router, Request, Response } from "express";


import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";


@injectable()
export class UsersRoute {
    private router: Router = express.Router();
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.users;


    public getRoute(): Router {


        this.router.route("/:userID")
            .get((req: Request, res: Response) => {
                const userID: number = +req.params.userID;
                // const dsp: any = dummyData.find(i => i.id === userID);
                // if (dsp)
                //     res.json(dsp);
                res.status(404).send("Not found");
            });

        this.router.route("/")
            .get((req: Request, res: Response) => {
                var query: QueryConfig = {
                    text: `SELECT * FROM ${this.tableName}`
                };
                this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                    res.json(queryRes.rows);
                }).catch((err) => {
                    res.json([]);
                })
            }).post((req, res) => {
                console.log(req,res);
            })


        return this.router;
    }

}
