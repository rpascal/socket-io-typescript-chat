
import * as express from "express";
import { Router, Request, Response } from "express";

import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { UserService, UserModel } from "../models/users";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

@injectable()
export class UsersRoute {
    private router: Router = express.Router();
    @inject(TYPES.UserService) private UserService: UserService;

    public getRoute(): Router {

        this.router.route("/authenticate")
            .post((req: Request, res) => {
                // console.log(req.body,req.headers,req.params);
                this.UserService.authenticate(req.body.username)
                    .then((user: UserModel) => {
                        console.log("authenticate", user)
                        if (user != null && bcrypt.compareSync(req.body.password, user.password)) {
                            console.log("authenticate yes")
                            user.token = jwt.sign({ sub: user.ID }, AppConfig.secret);

                            // authentication successful
                            res.send(user);
                        } else {
                            // authentication failed
                            res.status(400).send('Username or password is incorrect');
                        }
                    })
                    .catch(function (err) {
                        res.status(400).send(err);
                    });
            })


        this.router.route("/register")
            .post((req: Request, res) => {
                console.log("Resgister route", req.body);
                this.UserService.register(req.body)
                    .then(() => {
                        res.json('success');
                    })
                    .catch((err) => {
                        res.status(400).send(err);
                    });
            })


        this.router.route("/")
            .get((req: Request, res: Response) => {
                console.log("got into user service get server")
                this.UserService.getAll().then(data => {
                    res.json(data);
                });
            }).post((req, res) => {
                console.log(req, res);
            })


        return this.router;
    }

}
