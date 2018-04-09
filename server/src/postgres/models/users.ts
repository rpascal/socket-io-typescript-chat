
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import * as bcrypt from 'bcryptjs';


export class UserModel {
    ID?: number;
    NAME: string;
    password: string;
    created_at?: Date;
    token?: string;
}

export interface UserViewModel {
    ID?: number;
    NAME: string;
    created_at?: Date;
}

@injectable()
export class UserService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.users;

    private readonly notAuthed: string = "User not authenticated";

    constructor() {
    }

    public async authenticate(username): Promise<UserModel | boolean> {
        // console.log("got into authenticate")

        var query: QueryConfig = {
            text: `SELECT 
                ID,
                NAME,
                password,
                created_at
            FROM ${this.tableName}
            WHERE NAME = $1`,
            values: [username]
        };
        try {
            const queryRes = await this.BasePostgres.query(query);
            if (queryRes.rowCount > 0)
                return (queryRes.rows[0] as UserModel);
            return false;
        } catch (err) {
            return Promise.reject(err);
        }
        // return new Promise<UserModel>((resolve) => {
        //     console.log("got into authenticate promise")

        //     var query: QueryConfig = {
        //         text: `SELECT 
        //             ID,
        //             NAME,
        //             password,
        //             created_at
        //         FROM ${this.tableName}
        //         WHERE NAME = $1`,
        //         values: [username]
        //     };
        //     this.BasePostgres.query(query).then((queryRes: QueryResult) => {
        //         console.log("query auth rows", queryRes.rowCount);
        //         if (queryRes.rowCount > 0)
        //             resolve(queryRes.rows[0]);
        //         else
        //             resolve(null);

        //     }).catch((err) => {
        //         console.log("Error authenticating user");
        //         resolve(null);
        //     })

        // });
    }


    public async register(user: UserModel) {
        // console.log("got into register")


        try {
            const authedUser: UserModel | boolean = await this.authenticate(user.NAME);
            if (authedUser instanceof UserModel)
                return Promise.reject("Username already in use");
            await this.insert(user)
            return true;

        } catch (err) {
            // if (err === this.notAuthed) {
            //     try {
            //         await this.insert(user)
            //         return true;
            //     } catch (err) {
            //         return Promise.reject("Error creating user");
            //     }
            // }
            return Promise.reject("Error creating user");
        }



        // return new Promise<any>((resolve, reject) => {
        //     console.log("got into register promise")

        //     this.authenticate(user.NAME).then(userAuth => {
        //         console.log("register auth cehck", userAuth)
        //         if (userAuth) {
        //             reject("Username already in use");
        //         } else {
        //             this.insert(user).then(success => {
        //                 if (success)
        //                     resolve()
        //                 else
        //                     reject("Error creating user");
        //             })
        //         }
        //     }).catch((err) => {
        //         reject("Error Registering (Looking up username)")
        //     })

        // });
    }


    public getAll(): Promise<UserViewModel[]> {
        return new Promise<UserViewModel[]>((resolve) => {

            var query: QueryConfig = {
                text: `SELECT 
                    ID,
                    NAME,
                    created_at
                FROM ${this.tableName}`
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(queryRes.rows);
            }).catch((err) => {
                console.log("Error getting data from users table");
                resolve([]);
            })

        });
    }

    public async insert(user: UserModel): Promise<boolean> {
        // console.log("inserting", user);
        var query: QueryConfig = {
            text: `INSERT INTO ${this.tableName} (NAME,password) VALUES ($1, $2)`,
            values: [user.NAME, bcrypt.hashSync(user.password, 10)]
        };
        try {
            const queryRes = await this.BasePostgres.query(query);
            return true
        } catch (err) {
            return Promise.reject(err);
        }


        // return new Promise<boolean>((resolve) => {
        //     console.log("inserting promise");

        //     var query: QueryConfig = {
        //         text: `INSERT INTO ${this.tableName} (NAME,password) VALUES ($1, $2)`,
        //         values: [user.NAME, bcrypt.hashSync(user.password, 10)]
        //     };
        //     this.BasePostgres.query(query).then((queryRes: QueryResult) => {
        //         console.log("inserting YES");

        //         resolve(true);
        //     }).catch((err) => {
        //         console.log("Error inserting data into users table");
        //         resolve(false);
        //     })

        // });


    }




}