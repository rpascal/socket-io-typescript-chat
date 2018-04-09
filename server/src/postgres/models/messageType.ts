
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";

export interface MessageTypeModel {
    id?: number;
    type: string;
}


@injectable()
export class MessageTypeService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.messageType;

    constructor() {
    }


    public getAll(): Promise<MessageTypeModel[]> {
        return new Promise<MessageTypeModel[]>((resolve) => {

            var query: QueryConfig = {
                text: `SELECT 
                    id,
                    type
                FROM ${this.tableName}
                `
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(queryRes.rows);
            }).catch((err) => {
                console.log("Error getting data from MessageTypes table");
                resolve([]);
            })

        });
    }

    public insert(MessageType: MessageTypeModel): Promise<boolean> {

        return new Promise<boolean>((resolve) => {
            var query: QueryConfig = {
                text: `INSERT INTO ${this.tableName} (type) VALUES ($1)`,
                values: [MessageType.type]
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(true);
            }).catch((err) => {
                console.log("Error inserting data into MessageTypes table");
                resolve(false);
            })

        });


    }




}