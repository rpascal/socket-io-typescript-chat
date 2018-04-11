
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { UserService, UserModel, instanceOfUserModel } from "../models/users";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

@injectable()
export class UsersRoute {
    private router: Router = express.Router();
    @inject(TYPES.UserService) private UserService: UserService;

    public getRoute(): Router {

        this.router.route("/authenticate")
            .post(async (req: Request, res) => {

                try {
                    const authedUser = await this.UserService.authenticate(req.body.username);
                    if (instanceOfUserModel(authedUser)) {
                        if (bcrypt.compareSync(req.body.password, authedUser.password)) {
                            authedUser.token = jwt.sign({ sub: authedUser.id }, AppConfig.secret);
                            console.log("pre send")
                            res.send(authedUser);
                            return;
                        }
                    }
                    res.status(400).send('Username or password is incorrect');
                } catch (err) {
                    res.status(400).send(err);
                }
            })


        this.router.route("/register")
            .post(async (req: Request, res) => {
                try {
                    await this.UserService.register(req.body);
                    res.json('success');
                } catch (err) {
                    res.status(400).send(err);
                }
            })


        this.router.route("/")
            .get(async (req: Request, res: Response) => {
                try {
                    const users = await this.UserService.getAll();
                    res.json(users);
                } catch (err) {
                    res.status(400).send(err);
                }

            })


        return this.router;
    }

}
