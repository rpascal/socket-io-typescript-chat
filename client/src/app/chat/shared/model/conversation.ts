import { User } from "./user";

export interface ConversationModel {
    id?: number;
    title: string;
    creator_id: number;
    created_at?: Date;
    public: boolean;
}

export interface ConversationExpandedModel extends ConversationModel {
    users: User[];
}
