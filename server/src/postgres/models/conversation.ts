
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";

export interface ConversationModel {
    id?: number;
    title: string;
    creator_id: number;
    created_at?: Date;
    public: boolean;
}

export interface ConversationExpandedModel extends ConversationModel {
    sender_name: string;
}

@injectable()
export class ConversationService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.conversation;
    private readonly userTableName: string = AppConfig.tables.users;


    constructor() {
    }


    public getAll(): Promise<ConversationExpandedModel[]> {
        return new Promise<ConversationExpandedModel[]>((resolve) => {

            var query: QueryConfig = {
                text: `SELECT 
                    C.id,
                    C.title,
                    C.creator_id,
                    C.created_at,
                    C.public,
                    U.username AS sender_name
                FROM ${this.tableName} AS C
                LEFT JOIN ${this.userTableName} AS U ON C.creator_id = U.id
                `
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(queryRes.rows);
            }).catch((err) => {
                console.log("Error getting data from Conversations table");
                resolve([]);
            })

        });
    }

    public insert(Conversation: ConversationModel): Promise<boolean> {

        return new Promise<boolean>((resolve) => {
            var query: QueryConfig = {
                text: `INSERT INTO ${this.tableName} (title,creator_id,public) VALUES ($1, $2, $3)`,
                values: [Conversation.title, Conversation.creator_id, Conversation.public]
            };
            this.BasePostgres.query(query).then((queryRes: QueryResult) => {
                resolve(true);
            }).catch((err) => {
                console.log("Error inserting data into Conversations table");
                resolve(false);
            })

        });


    }




}
