import {User} from './user';
import {Action} from './action';

export interface Message {
    from?: User;
    content?: any;
    action?: Action;
}


export interface MessageModel {
    id?: number;
    conversation_id?: number;
    sender_id?: number;
    message_type?: number;
    message?: string;
    created_at?: Date;
}

export interface MessageExpandedModel extends MessageModel {
    message_type_str?: string;
    sender_name?: string;
}
