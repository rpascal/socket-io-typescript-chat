
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";

export interface MessageModel {
    ID?: number;
    conversation_id: number;
    sender_id: number;
    message_type: number;
    message: string;
    created_at?: Date;
}

export interface MessageExpandedModel extends MessageModel {
    message_type_str: string;
    sender_name: string;
}




@injectable()
export class MessageService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.messages;
    private readonly userTableName: string = AppConfig.tables.users;
    private readonly messageTypeTableName: string = AppConfig.tables.messageType;


    constructor() {
    }


    public getAll(converstionID: number): Promise<MessageExpandedModel[]> {
        return new Promise<MessageExpandedModel[]>((resolve) => {

            var query: QueryConfig = {
                text: `SELECT 
                    M.ID,
                    M.conversation_id,
                    M.sender_id,
                    M.message_type,
                    M.message,
                    M.created_at,
                    U.NAME AS sender_name,
                    MT.type AS message_type_str
                FROM ${this.tableName} AS M
                LEFT JOIN ${this.userTableName} AS U ON M.sender_id = U.ID
                LEFT JOIN ${this.messageTypeTableName} AS MT ON M.message_type = MT.ID
                WHERE conversation_id = $1
                `,
                values: [converstionID]
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(queryRes.rows);
            }).catch((err) => {
                console.log("Error getting data from Messages table");
                resolve([]);
            })

        });
    }

    public insert(Message: MessageModel): Promise<boolean> {

        return new Promise<boolean>((resolve) => {
            var query: QueryConfig = {
                text: `INSERT INTO ${this.tableName} (conversation_id,sender_id,message_type,message) VALUES ($1, $2, $3, $4)`,
                values: [Message.conversation_id, Message.sender_id, Message.message_type, Message.message]
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(true);
            }).catch((err) => {
                console.log("Error inserting data into Messages table");
                resolve(false);
            })

        });


    }




}