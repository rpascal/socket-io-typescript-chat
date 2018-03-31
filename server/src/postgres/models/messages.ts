export interface messages {
    ID: number;
    type: string;
    conversation_id: number;
    sender_id: number;
    message_type: number;
    message: string;
    created_at: Date;
}