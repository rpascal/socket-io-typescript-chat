
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { UserViewModel } from "./users";
import * as _ from "lodash";

export interface ConversationModel {
    id?: number;
    title: string;
    creator_id: number;
    created_at?: Date;
    public: boolean;
}

export interface ConversationExpandedModel extends ConversationModel {
    users: UserViewModel[];
}

@injectable()
export class ConversationService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;

    private readonly tableName: string = AppConfig.tables.conversation;
    private readonly userTableName: string = AppConfig.tables.users;
    private readonly conversationUsersTableName: string = AppConfig.tables.conversationusers;

    constructor() {
    }


    public async getUsersConversations(userID: number): Promise<ConversationModel[]> {
        
        var query: QueryConfig = {
            text: `
            SELECT 
                C.id,
                C.title,
                C.creator_id,
                C.created_at,
                C.public
            FROM ${this.conversationUsersTableName} AS CU 
            LEFT JOIN ${this.tableName} AS C ON CU.conversation_id = C.id
            WHERE CU.user_id = ${userID} 
            `
        };

        try {
            const queryRes = await this.BasePostgres.query(query);
            return (queryRes.rows as ConversationModel[])
        } catch (err) {
            return Promise.reject(err);
        }

    }

    public async insert(Conversation: ConversationModel): Promise<boolean> {
        var query: QueryConfig = {
            text: `INSERT INTO ${this.tableName} (title,creator_id,public) VALUES ($1, $2, $3)`,
            values: [Conversation.title, Conversation.creator_id, Conversation.public]
        };
        try {
            const queryRes = await this.BasePostgres.query(query);
            return true
        } catch (err) {
            return Promise.reject(err);
        }

        // return new Promise<boolean>((resolve) => {

        //     this.BasePostgres.query(query).then((queryRes: QueryResult) => {
        //         resolve(true);
        //     }).catch((err) => {
        //         console.log("Error inserting data into Conversations table");
        //         resolve(false);
        //     })

        // });


    }




}
