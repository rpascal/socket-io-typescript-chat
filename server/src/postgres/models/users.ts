
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";



export interface UserModel {
    ID?: number;
    NAME: string;
    password: string;
    created_at?: Date;
}

export interface UserViewModel{
    ID?: number;
    NAME: string;
    created_at?: Date;
}

@injectable()
export class UserService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.users;

    constructor() {
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

    public insert(user: UserModel): Promise<boolean> {

        return new Promise<boolean>((resolve) => {

            var query: QueryConfig = {
                text: `INSERT INTO ${this.tableName} (NAME,password) VALUES ($1, $2)`,
                values: [user.NAME, user.password]
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(true);
            }).catch((err) => {
                console.log("Error inserting data into users table");
                resolve(false);
            })

        });


    }




}