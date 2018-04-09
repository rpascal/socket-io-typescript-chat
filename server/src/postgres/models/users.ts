
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import * as bcrypt from 'bcryptjs';


export interface UserModel {
    id?: number;
    username: string;
    password: string;
    created_at?: Date;
    token?: string;
}

export function instanceOfUserModel(model: UserModel | boolean): model is UserModel {
    if(typeof model == "boolean"){
        return false;
    }
    return (<UserModel>model).username !== undefined;
}

export interface UserViewModel {
    id?: number;
    username: string;
    created_at?: Date;
}

@injectable()
export class UserService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.users;

    constructor() {
    }

    public async authenticate(username): Promise<UserModel | boolean> {
        var query: QueryConfig = {
            text: `SELECT 
                id,
                username,
                password,
                created_at
            FROM ${this.tableName}
            WHERE username = $1`,
            values: [username]
        };
        try {
            const queryRes = await this.BasePostgres.query(query);
            console.log("auth", queryRes.rowCount)
            if (queryRes.rowCount > 0)
                return (queryRes.rows[0] as UserModel);
            return false;
        } catch (err) {
            return Promise.reject(err);
        }

    }


    public async register(user: UserModel) {
        try {
            const authedUser: UserModel | boolean = await this.authenticate(user.username);
            if (instanceOfUserModel(authedUser))
                return Promise.reject("Username already in use");
            await this.insert(user)
            return true;

        } catch (err) {
            return Promise.reject("Error creating user");
        }
    }


    public async getAll(): Promise<UserViewModel[]> {
        var query: QueryConfig = {
            text: `SELECT 
                    id,
                    username,
                    created_at
                FROM ${this.tableName}`
        };
        try {
            const queryRes = await this.BasePostgres.query(query);
            return (queryRes.rows as UserViewModel[])
        } catch (err) {
            return Promise.reject("Error getting data from users table");
        }
    }

    public async insert(user: UserModel): Promise<boolean> {
        var query: QueryConfig = {
            text: `INSERT INTO ${this.tableName} (username,password) VALUES ($1, $2)`,
            values: [user.username, bcrypt.hashSync(user.password, 10)]
        };
        try {
            const queryRes = await this.BasePostgres.query(query);
            console.log("insert good")

            return true
        } catch (err) {
            return Promise.reject(err);
        }
    }

}