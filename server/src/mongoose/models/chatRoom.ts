import { connect as MonConnect, model as MonModel, Schema, createConnection, Connection, Document, Model } from 'mongoose'

export interface IChatRoom{
    roomName: string;
}
export interface IChatRoomDocument extends Document, IChatRoom {}



const ChatRoomSchema = new Schema({ roomName: String });

export interface IChatRoomModel extends Model<IChatRoomDocument> {
    getAll(): Promise<IChatRoomDocument[]>,
    add(chatRoom: IChatRoom): Promise<IChatRoomDocument>
}

ChatRoomSchema.static("getAll",() => {

    return ChatRoom
        .find({})
        .lean()
        .exec();
});

ChatRoomSchema.static("add",(chatRoom: IChatRoom) => {
    const newRoom: IChatRoomDocument = new ChatRoom();
    newRoom.roomName = chatRoom.roomName;
    return newRoom.save();
});



export const ChatRoom = MonModel<IChatRoomDocument>("ChatRoom", ChatRoomSchema) as IChatRoomModel;
