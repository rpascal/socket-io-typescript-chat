
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";

export interface MessageModel {
    id?: number;
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


    public getAll(converstionid: number): Promise<MessageExpandedModel[]> {
        return new Promise<MessageExpandedModel[]>((resolve) => {

            var query: QueryConfig = {
                text: `SELECT 
                    M.id,
                    M.conversation_id,
                    M.sender_id,
                    M.message_type,
                    M.message,
                    M.created_at,
                    U.username AS sender_name,
                    MT.type AS message_type_str
                FROM ${this.tableName} AS M
                LEFT JOIN ${this.userTableName} AS U ON M.sender_id = U.id
                LEFT JOIN ${this.messageTypeTableName} AS MT ON M.message_type = MT.id
                WHERE conversation_id = $1
                order by M.created_at
                `,
                values: [converstionid]
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(queryRes.rows);
            }).catch((err) => {
                console.log("Error getting data from Messages table");
                resolve([]);
            })

        });
    }

    public async insert(Message: MessageModel): Promise<MessageExpandedModel> {

        try {
            var query: QueryConfig = {
                text: `INSERT INTO ${this.tableName} (conversation_id,sender_id,message_type,message) VALUES ($1, $2, $3, $4) RETURNING id`,
                values: [Message.conversation_id, Message.sender_id, Message.message_type, Message.message]
            };
            const queryRes = await this.BasePostgres.query(query);


            if (queryRes.rowCount > 0) {
                var query: QueryConfig = {
                    text: `SELECT 
                        M.id,
                        M.conversation_id,
                        M.sender_id,
                        M.message_type,
                        M.message,
                        M.created_at,
                        U.username AS sender_name,
                        MT.type AS message_type_str
                    FROM ${this.tableName} AS M
                    LEFT JOIN ${this.userTableName} AS U ON M.sender_id = U.id
                    LEFT JOIN ${this.messageTypeTableName} AS MT ON M.message_type = MT.id
                    WHERE M.id = $1
                    `,
                    values: [queryRes.rows[0].id]
                };
                const newMessage = await this.BasePostgres.query(query);
                return newMessage.rows[0] as MessageExpandedModel;

            }

        } catch (err) {
            return Promise.reject(err);
        }

    }




}