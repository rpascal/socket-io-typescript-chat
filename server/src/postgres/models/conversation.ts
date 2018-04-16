
import { injectable, inject } from "inversify";
import { TYPES } from "../../_config/inversifyTypes";
import { BasePostgres } from "../base";
import { QueryConfig, QueryResult } from "pg";
import { AppConfig } from "../../_config/app.config";
import { UserViewModel, UserService, UserModel } from "./users";
import * as _ from "lodash";

export interface ConversationModel {
    id?: number;
    title: string;
    creator_id: number;
    created_at?: Date;
    public: boolean;
}

export interface ConversationExpandedModel extends ConversationModel {
    users: number[];
}

@injectable()
export class ConversationService {
    @inject(TYPES.BasePostgres) private BasePostgres: BasePostgres;
    @inject(TYPES.UserService) private UserService: UserService;



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

    public async create(model: ConversationExpandedModel): Promise<void> {

        model.users.push(model.creator_id);


        try {

            await this.BasePostgres.transaction(async (client) => {
                var query: QueryConfig = {
                    text: `INSERT INTO ${this.tableName} (title,creator_id,public) VALUES ($1, $2, $3) RETURNING id`,
                    values: [model.title, model.creator_id, model.public]
                };
                const { rows, rowCount } = await client.query(query)
                if (rowCount > 0) {
                    await model.users.forEach(async userID => {
                        var query: QueryConfig = {
                            text: `INSERT INTO ${this.conversationUsersTableName} (conversation_id,user_id) VALUES ($1, $2)`,
                            values: [rows[0].id, userID]
                        };
                        await client.query(query);
                    })
                }
            })

            return;
        } catch (err) {
            return Promise.reject(err);
        }


    }

    public async getUsersNotInConversation(ConversationID: number): Promise<UserViewModel[]> {

        var query: QueryConfig = {
            text: `
                SELECT 
                    user_id
                FROM ${this.conversationUsersTableName}
                WHERE CU.conversation_id = ${ConversationID} 
                `
        };

        try {

            const users = await this.UserService.getAll();
            const usersInConversation = await this.BasePostgres.query(query);
            const data = usersInConversation.rows as number[];
            return users.filter(x => {
                return data.findIndex(y => y == x.id) == -1;
            })

        } catch (err) {
            return Promise.reject(err);
        }

    }


    public async addUsers(ConversationID: number, userIds: number[]): Promise<boolean> {
        try {
            await this.BasePostgres.transaction(async (client) => {
                await userIds.forEach(async userID => {
                    var query: QueryConfig = {
                        text: `INSERT INTO ${this.conversationUsersTableName} (conversation_id,user_id) VALUES ($1, $2)`,
                        values: [ConversationID, userID]
                    };
                    await client.query(query);
                })
            })

            return true
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async removeUser(ConversationID: number, userID: number): Promise<void> {
        try {
            var query: QueryConfig = {
                text: `DELETE FROM ${this.conversationUsersTableName} WHERE conversation_id = $1 AND user_id = $2`,
                values: [ConversationID, userID]
            };
            await this.BasePostgres.query(query);
        } catch (err) {
            return Promise.reject(err);
        }
    }

}
